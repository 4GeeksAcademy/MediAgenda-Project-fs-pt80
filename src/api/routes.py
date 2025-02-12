"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, session
from api.models import db, Users, Pacientes, Especialistas, DisponibilidadMedico, Citas, List_Tokens
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime, timedelta, timezone
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2 import service_account
import os

api = Blueprint('api', __name__)

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
CLIENT_SECRET_FILE = "./client_secret.json" 
SCOPES = ["https://www.googleapis.com/auth/calendar"]

# Flujo de OAuth
flow = Flow.from_client_secrets_file(
    CLIENT_SECRET_FILE,
    scopes=SCOPES,
    redirect_uri="https://expert-space-waffle-r4rvrxxwg5r63pvp5-3000.app.github.dev"
)


# Allow CORS requests to this API
CORS(api)

# @api.before_first_req
# def setup_database():
#     db.createall()



#MediAgenda endpoints

@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        print("Datos recibidos:", data)

        if not data.get('email') or not data.get('password') or not data.get('nombre') or not data.get('apellido'):
            return jsonify({"error": "Datos incompletos"}), 400

        existing_user = Users.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "El usuario ya existe"}), 400


        new_user = Users(
            nombre=data['nombre'],
            apellido=data['apellido'],
            email=data['email'],
            paciente=data['paciente'],
            is_active=True
        )

    
        new_user.set_password(data['password'])  


        db.session.add(new_user)
        db.session.commit()  

        if data['paciente']:
            new_patient = Pacientes(user_id=new_user.id)
            db.session.add(new_patient)
        else:
            new_specialist = Especialistas(
                user_id=new_user.id,
                especialidades=data.get('especialidades', None),
                telefono_oficina=data.get('telefono_oficina', None),
                clinica=data.get('clinica', None),
                numero_colegiatura=data.get('numero_colegiatura', None),
                direccion_centro_trabajo=data.get('direccion_centro_trabajo', None),
                descripcion=data.get('descripcion', None)
            )
            db.session.add(new_specialist)

        db.session.commit()

       
        access_token = create_access_token(identity=str(new_user.id))
        return jsonify({"msg": "Usuario registrado exitosamente", "token": access_token}), 201

    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.json

        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Datos incompletos"}), 400

        user = Users.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            return jsonify({"error": "Credenciales inválidas"}), 401

        
        access_token = create_access_token(identity=str(user.id))

        return jsonify({"msg": "Inicio de sesion exitoso", "token": access_token, "user": user.serialize()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@api.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    try:
        current_user = get_jwt_identity()
        user = Users.query.get(current_user)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # ✅ OBTENER PERFIL (GET)
        if request.method == 'GET':
            if user.paciente:
                patient_profile = Pacientes.query.filter_by(user_id=user.id).first()
                if not patient_profile:
                    return jsonify({"error": "Perfil de paciente no encontrado"}), 404

                especialistas = db.session.query(Especialistas, Users).join(Users, Especialistas.user_id == Users.id).all()

                doctors_list = [
                    {
                        "id": doctor.id,
                        "nombre": user.nombre,
                        "apellido": user.apellido,
                        "especialidades": doctor.especialidades,
                        "telefono_oficina": doctor.telefono_oficina or "",
                        "clinica": doctor.clinica or "",
                        "numero_colegiatura": doctor.numero_colegiatura or "",
                        "direccion_centro_trabajo": doctor.direccion_centro_trabajo or "",
                        "descripcion": doctor.descripcion or "",
                    }
                    for doctor, user in especialistas
                ]

                return jsonify({
                    "role": "paciente",
                    "user": user.serialize(),
                    "profile": patient_profile.serialize(),
                    "doctors": doctors_list
                }), 200

            else:
                specialist_profile = Especialistas.query.filter_by(user_id=user.id).first()
                if not specialist_profile:
                    return jsonify({"error": "Perfil de especialista no encontrado"}), 404

                return jsonify({
                    "role": "especialista",
                    "user": user.serialize(),
                    "profile": specialist_profile.serialize()
                }), 200

       
        elif request.method == 'PUT':
            data = request.get_json()
            if not data:
                return jsonify({"error": "No se enviaron datos"}), 400

            # 🔹 Actualizar datos generales del usuario
            user.nombre = data.get("nombre", user.nombre)
            user.apellido = data.get("apellido", user.apellido)
            user.email = data.get("email", user.email)

            if user.paciente:
                patient_profile = Pacientes.query.filter_by(user_id=user.id).first()
                if not patient_profile:
                    return jsonify({"error": "Perfil de paciente no encontrado"}), 404

                patient_profile.telefono = data.get("telefono") or patient_profile.telefono
                patient_profile.direccion = data.get("direccion") or patient_profile.direccion
                patient_profile.genero = data.get("genero") or patient_profile.genero
                patient_profile.fecha_nacimiento = data.get("fecha_nacimiento") or patient_profile.fecha_nacimiento

            else:
                specialist_profile = Especialistas.query.filter_by(user_id=user.id).first()
                if not specialist_profile:
                    return jsonify({"error": "Perfil de especialista no encontrado"}), 404

                specialist_profile.telefono_oficina = data.get("telefono_oficina") or specialist_profile.telefono_oficina
                specialist_profile.clinica = data.get("clinica") or specialist_profile.clinica
                specialist_profile.numero_colegiatura = data.get("numero_colegiatura") or specialist_profile.numero_colegiatura
                specialist_profile.direccion_centro_trabajo = data.get("direccion_centro_trabajo") or specialist_profile.direccion_centro_trabajo
                specialist_profile.descripcion = data.get("descripcion") or specialist_profile.descripcion
                specialist_profile.especialidades = data.get("especialidades") or specialist_profile.especialidades

            db.session.commit()  # ✅ Solo un commit al final

            return jsonify({
                "msg": "Perfil actualizado correctamente",
                "user": user.serialize(),
                "profile": specialist_profile.serialize() if not user.paciente else patient_profile.serialize()
            }), 200

    except Exception as e:
        db.session.rollback()
        print("❌ Error en profile:", str(e))
        return jsonify({"error": str(e)}), 500

def refresh_google_token(user):
    try:
        if not user.google_refresh_token:
            return None, "No refresh token available"
        
        credentials = Credentials(
            None,
            refresh_token=user.google_refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("REACT_APP_CLIENT_ID"),
            client_secret=os.getenv("BACKEND_CLIENT_SECRET"),
        )
        
        credentials.refresh(request())
        user.google_access_token = credentials.token 
        db.session.commit()
        
        return credentials.token, None
    except Exception as e:
        return None, str(e)

    
@api.route('/auth/google', methods=['GET'])
def google_auth():
    auth_url, state = flow.authorization_url(access_type="offline", prompt="consent")
    session["oauth_state"] = state
    return jsonify({"auth_url": auth_url})

@api.route('/auth/google/callback', methods=['GET'])
def google_callback():
    try:
        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials

        
        user_email = credentials.id_token.get("email")
        user = Users.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        
        user.google_access_token = credentials.token
        user.google_refresh_token = credentials.refresh_token if credentials.refresh_token else user.google_refresh_token
        db.session.commit()

        return jsonify({
            "access_token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/refresh_token', methods=['GET'])
@jwt_required()
def refresh_token():
    try:
        current_user = get_jwt_identity()
        user = Users.query.get(current_user)

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        new_token, error = refresh_google_token(user)

        if error:
            return jsonify({"error": error}), 400

        return jsonify({"access_token": new_token}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/disponibilidad', methods=['GET'])
@jwt_required()
def obtener_disponibilidad():
    try:
        medico_id = request.args.get("medico_id")

        if not medico_id:
            return jsonify({"error": "Se requiere un ID de médico"}), 400

        # 🔹 Buscar correctamente al especialista usando `user_id`
        especialista = Especialistas.query.filter_by(user_id=medico_id).first()

        if not especialista:
            return jsonify({"error": "Médico no encontrado"}), 404

        disponibilidad = DisponibilidadMedico.query.filter_by(medico_id=especialista.id).all()

        return jsonify({"disponibilidad": [dispo.serialize() for dispo in disponibilidad]}), 200
    except Exception as e:
        print("❌ Error en obtener_disponibilidad:", str(e))
        return jsonify({"error": str(e)}), 500


@api.route('/disponibilidad', methods=['POST'])
@jwt_required()
def crear_disponibilidad():
    try:
        current_user = get_jwt_identity()
        especialista = db.session.query(Especialistas).filter_by(user_id=current_user).first()

        if not especialista:
            return jsonify({'error': 'No autorizado o especialista no encontrado'}), 403

        data = request.json
        fecha = data['fecha']
        hora_inicio = data['hora_inicio']
        hora_final = data['hora_final']

        credentials = Credentials(data.get("access_token"))
        service = build("calendar", "v3", credentials=credentials)

        start_time = f"{fecha}T{hora_inicio}:00"
        end_time = f"{fecha}T{hora_final}:00"

        event_body = {
            "summary": "Disponibilidad del Médico",
            "description": f"El Dr. {especialista.users.nombre} {especialista.users.apellido} está disponible.",
            "start": {"dateTime": start_time, "timeZone": "Europe/Madrid"},
            "end": {"dateTime": end_time, "timeZone": "Europe/Madrid"},
        }

        event = service.events().insert(calendarId="primary", body=event_body).execute()

        nueva_disponibilidad = DisponibilidadMedico(
            medico_id=especialista.id,
            fecha=fecha,
            hora_inicio=hora_inicio,
            hora_final=hora_final,
            is_available=True
        )
        db.session.add(nueva_disponibilidad)
        db.session.commit()

        return jsonify({"msg": "Disponibilidad creada con éxito", "event_id": event["id"]}), 201
    except Exception as e:
        db.session.rollback()
        print("❌ Error en crear_disponibilidad:", str(e))
        return jsonify({"error": str(e)}), 500

@api.route('/disponibilidad/<int:id>', methods=['PUT'])
@jwt_required()
def actualizar_disponibilidad(id):
    try:
        current_user = get_jwt_identity()
        especialista = Especialistas.query.filter_by(user_id=current_user).first()
        if not especialista:
            return jsonify({'error': 'No autorizado'}), 403

        disponibilidad = DisponibilidadMedico.query.get(id)
        if not disponibilidad or disponibilidad.medico_id != especialista.id:
            return jsonify({'error': 'Disponibilidad no encontrada'}), 404

        data = request.json
        nueva_fecha = datetime.strptime(data.get('fecha', disponibilidad.fecha.strftime('%Y-%m-%d')), "%Y-%m-%d").date()
        nueva_hora_inicio = datetime.strptime(data.get('hora_inicio', disponibilidad.hora_inicio.strftime('%H:%M')), "%H:%M").time()
        nueva_hora_final = datetime.strptime(data.get('hora_final', disponibilidad.hora_final.strftime('%H:%M')), "%H:%M").time()

        google_token = request.headers.get("X-Google-Access-Token")
        if not google_token:
            return jsonify({"error": "Token de Google no enviado"}), 400

        credentials = Credentials(google_token)
        service = build("calendar", "v3", credentials=credentials)

        start_time = f"{nueva_fecha}T{nueva_hora_inicio}"
        end_time = f"{nueva_fecha}T{nueva_hora_final}"

        event_body = {
            "start": {"dateTime": start_time, "timeZone": "Europe/Madrid"},
            "end": {"dateTime": end_time, "timeZone": "Europe/Madrid"},
        }

        updated_event = service.events().update(
            calendarId="primary", eventId=disponibilidad.google_event_id, body=event_body
        ).execute()

        disponibilidad.fecha = nueva_fecha
        disponibilidad.hora_inicio = nueva_hora_inicio
        disponibilidad.hora_final = nueva_hora_final
        db.session.commit()

        return jsonify({"msg": "Disponibilidad actualizada con éxito", "event": updated_event}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/disponibilidad/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_disponibilidad(id):
    try:
        current_user = get_jwt_identity()
        especialista = Especialistas.query.filter_by(user_id=current_user).first()

        if not especialista:
            return jsonify({'error': 'No autorizado'}), 403

        disponibilidad = DisponibilidadMedico.query.get(id)
        if not disponibilidad or disponibilidad.medico_id != especialista.id:
            return jsonify({'error': 'Disponibilidad no encontrada'}), 404

        google_event_id = disponibilidad.google_event_id  # ✅ Obtener el ID del evento en Google Calendar

        if google_event_id:  # ✅ Solo eliminar si hay un evento asociado en Google Calendar
            google_token = request.headers.get("X-Google-Access-Token")
            if not google_token:
                return jsonify({"error": "Token de Google no enviado"}), 400

            credentials = Credentials(google_token)
            service = build("calendar", "v3", credentials=credentials)

            try:
                service.events().delete(calendarId="primary", eventId=google_event_id).execute()
                print("✅ Evento eliminado en Google Calendar")
            except Exception as e:
                print("❌ Error al eliminar en Google Calendar:", str(e))

        db.session.delete(disponibilidad)
        db.session.commit()

        return jsonify({"msg": "Disponibilidad eliminada con éxito"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


def get_calendar_service_from_token(google_token):
    credentials = Credentials(google_token)
    service = build('calendar', 'v3', credentials=credentials)
    return service

def create_google_event(appointment_data, google_token):
    credentials = Credentials(google_token)
    service = build("calendar", "v3", credentials=credentials)
    
    date_str = appointment_data["appointment_date"]
    time_str = appointment_data["appointment_time"]
    start_datetime = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    end_datetime = start_datetime + timedelta(hours=1) 
    start_t = start_datetime.isoformat()
    end_t = end_datetime.isoformat()
    
    event = {
        'summary': appointment_data.get("doctorName", "Cita Médica"),
        'description': appointment_data.get("description", "Cita agendada desde la aplicación"),
        'start': {
            'dateTime': start_t,
            'timeZone': 'UTC'
        },
        'end': {
            'dateTime': end_t,
            'timeZone': 'UTC'
        },
    }
    
    created_event = service.events().insert(calendarId='primary', body=event).execute()
    return created_event['id']

def cancel_google_event(google_event_id, google_token):
    credentials = Credentials(google_token)
    service = build("calendar", "v3", credentials=credentials)
    try:
        service.events().delete(calendarId='primary', eventId=google_event_id).execute()
        return True
    except Exception as e:
        print("Error al cancelar el evento en Google Calendar:", e)
        return False

@api.route('/citas', methods=['POST'])
@jwt_required()
def agendar_cita():
    try:
        current_user = get_jwt_identity()
        user = Users.query.get(current_user)
        data = request.get_json()
        
        google_token = request.headers.get("X-Google-Access-Token")
        if not google_token:
            google_token, error = refresh_google_token(user)
            if error:
                return jsonify({"error": "No se pudo refrescar el token de Google", "details": error}), 400
        
        google_event_id = create_google_event(data, google_token)
        
        nueva_cita = Citas(
            paciente_id=current_user,
            medico_id=data.get("medico_id"),
            appointment_date=data.get("appointment_date"),
            appointment_time=data.get("appointment_time"),
            estado=data.get("estado", "confirmada").strip().lower(),
            google_event_id=google_event_id
        )
        db.session.add(nueva_cita)
        db.session.commit()
        
        return jsonify({"msg": "Cita agendada con éxito", "google_event_id": google_event_id}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/citas', methods=['GET'])
@jwt_required()
def list_citas():
    try:
        current_user = get_jwt_identity()
        user = Users.query.get(current_user)

       
        citas_db = Citas.query.filter_by(paciente_id=current_user).all() if user.paciente else Citas.query.filter_by(medico_id=current_user).all()
        citas_serializadas = [cita.serialize() for cita in citas_db]

        google_token = request.headers.get("X-Google-Access-Token")
        google_events = []

        if google_token:
            try:
                service = get_calendar_service_from_token(google_token)
                now = datetime.now().isoformat() + "Z"
                events_result = service.events().list(
                    calendarId="primary",
                    timeMin=now,
                    singleEvents=True,
                    orderBy="startTime"
                ).execute()

                for event in events_result.get("items", []):
                    google_events.append({
                        "google_event_id": event.get("id"),
                        "summary": event.get("summary"),
                        "start": event["start"].get("dateTime"),
                        "end": event["end"].get("dateTime"),
                        "attendees": event.get("attendees", [])
                    })

            except Exception as e:
                print("❌ Error obteniendo eventos de Google Calendar:", str(e))

        # Retornar citas de la BD + eventos de Google Calendar
        return jsonify({"msg": "Citas obtenidas exitosamente", "citas": citas_serializadas + google_events}), 200

    except Exception as e:
        print("❌ Error general en list_citas:", str(e))
        return jsonify({"error": str(e)}), 500

@api.route('/citas/<string:google_event_id>', methods=['DELETE'])
@jwt_required()
def cancel_cita(google_event_id):
    try:
        current_user = get_jwt_identity()
        user = Users.query.get(current_user)
        
        if user.paciente:
            appointment = Citas.query.filter_by(google_event_id=google_event_id, paciente_id=current_user).first()
        else:
            appointment = Citas.query.filter_by(google_event_id=google_event_id, medico_id=current_user).first()
        if not appointment:
            return jsonify({"error": "Cita no encontrada"}), 404

        google_token = request.headers.get("X-Google-Access-Token")
        if not google_token:
            return jsonify({"error": "Token de Google no enviado"}), 400

      
        if not cancel_google_event(google_event_id, google_token):
            return jsonify({"error": "Error al cancelar la cita en Google Calendar"}), 500

        db.session.delete(appointment)
        db.session.commit()

        return jsonify({"message": "Cita cancelada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
