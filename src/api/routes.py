"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, session
from api.models import db, Users, Pacientes, Especialistas, DisponibilidadMedico, Citas, List_Tokens
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime, timedelta, timezone
import os

api = Blueprint('api', __name__)

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
CLIENT_SECRET_FILE = "./client_secret.json" 
SCOPES = ["https://www.googleapis.com/auth/calendar"]

# Flujo de OAuth
flow = Flow.from_client_secrets_file(
    CLIENT_SECRET_FILE,
    scopes=SCOPES,
    redirect_uri="https://glowing-succotash-5g4p4995q9vw2v6q6-3001.app.github.dev/redirect"
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

        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Datos incompletos"}), 400

        existing_user = Users.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "El usuario ya existe"}), 400

       
        new_user = Users(
            nombre=data['nombre'],
            apellido=data['apellido'],
            email=data['email'],
            password=data['password'],
            paciente=data['paciente'],
            is_active=True
        )
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.flush()  


        
        if data['paciente']:
            new_patient = Pacientes(user_id=new_user.id)
            db.session.add(new_patient)
        else:
            print("especialista_data:", data.get('especialidades'))
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
    

@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user = get_jwt_identity()
        user = Users.query.get(current_user)

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        
        if user.paciente:
          
            patient_profile = Pacientes.query.filter_by(user_id=user.id).first()
            if not patient_profile:
                return jsonify({"error": "Perfil de paciente no encontrado"}), 404

            return jsonify({
                "role": "paciente",
                "user": user.serialize(),
                "profile": patient_profile.serialize()
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

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/auth/google', methods=['GET'])
def google_auth():
    auth_url, state = flow.authorization_url(prompt="consent")
    session["oauth_state"] = state
    return jsonify({"auth_url": auth_url})

@api.route('/auth/google/callback', methods=['GET'])
def google_callback():
    try:
        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials
        return jsonify({
            "access_token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/disponibilidad', methods=['GET'])
@jwt_required()
def obtener_disponibilidad():
    try:
        medico_id = request.args.get("medico_id")
        medico = Especialistas.query.get(medico_id)

        if not medico:
            return jsonify({"error": "Médico no encontrado"}), 404

        credentials = Credentials(request.headers.get("Authorization").split(" ")[1])
        service = build("calendar", "v3", credentials=credentials)

        now = datetime.now().isoformat() + "Z"
        events_result = service.events().list(
            calendarId="primary",
            timeMin=now,
            maxResults=20,
            singleEvents=True,
            orderBy="startTime"
        ).execute()

        eventos = events_result.get("items", [])

        disponibilidad = [
            {
                "id": e["id"],
                "start": e["start"]["dateTime"],
                "end": e["end"]["dateTime"]
            }
            for e in eventos
        ]

        return jsonify({"disponibilidad": disponibilidad}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/disponibilidad', methods=['POST'])
@jwt_required()
def crear_disponibilidad():
    try:
        current_user = get_jwt_identity()
        especialista = Especialistas.query.filter_by(user_id=current_user).first()
        # if not especialista:
        #     return jsonify({'error': 'No autorizado'}), 403
        
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
            "description": f"El Dr. {especialista.user.nombre} {especialista.user.apellido} está disponible en este horario.",
            "start": {"dateTime": start_time, "timeZone": "Europe/Madrid"},
            "end": {"dateTime": end_time, "timeZone": "Europe/Madrid"},
        }

        event = service.events().insert(calendarId="primary", body=event_body).execute()
        
        nueva_disponibilidad = DisponibilidadMedico(
            medico_id=especialista.id,
            fecha=fecha,
            hora_inicio=hora_inicio,
            hora_final=hora_final,
            is_available=True,
            google_event_id=event["id"]
        )
        db.session.add(nueva_disponibilidad)
        db.session.commit()

        return jsonify({"msg": "Disponibilidad creada con éxito", "event_id": event["id"]}), 201
    except Exception as e:
        db.session.rollback()
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
        nueva_fecha = data.get('fecha', disponibilidad.fecha)
        nueva_hora_inicio = data.get('hora_inicio', disponibilidad.hora_inicio)
        nueva_hora_final = data.get('hora_final', disponibilidad.hora_final)

        credentials = Credentials(data.get("access_token"))
        service = build("calendar", "v3", credentials=credentials)

        start_time = f"{nueva_fecha}T{nueva_hora_inicio}:00"
        end_time = f"{nueva_fecha}T{nueva_hora_final}:00"

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

        credentials = Credentials(request.json.get("access_token"))
        service = build("calendar", "v3", credentials=credentials)

        service.events().delete(calendarId="primary", eventId=disponibilidad.google_event_id).execute()

        db.session.delete(disponibilidad)
        db.session.commit()

        return jsonify({"msg": "Disponibilidad eliminada con éxito"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# @api.route('/auth/google', methods=['GET'])
# def google_auth():
#     flow = Flow.from_client_secrets_file(
#         CLIENT_SECRET_FILE, 
#         scopes=SCOPES, 
#         redirect_uri= "https://glowing-succotash-5g4p4995q9vw2v6q6-3001.app.github.dev"
#     )
    
#     auth_url, state = flow.authorization_url(prompt="consent")
  
#     session["oauth_state"] = state

#     return jsonify({"auth_url": auth_url})


# @api.route('/auth/google/callback', methods=['GET'])
# def google_callback():
#     try:
#         flow = Flow.from_client_secrets_file(
#         CLIENT_SECRET_FILE, 
#         scopes=SCOPES, 
#         redirect_uri="https://glowing-succotash-5g4p4995q9vw2v6q6-3001.app.github.dev")

#         # if "oauth_state" not in session or session["oauth_state"] != request.args.get("state"):
#         #     return jsonify({"error": "CSRF Warning! State mismatch."}), 400

#         flow.fetch_token(authorization_response=request.url)
#         credentials = flow.credentials

#         return jsonify({
#             "access_token": credentials.token,
#             "refresh_token": credentials.refresh_token,
#             "token_uri": credentials.token_uri,
#             "client_id": credentials.client_id,
#             "client_secret": credentials.client_secret,
#         }), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @api.route('/disponibilidad', methods=['POST'])
# @jwt_required()
# def crear_disponibilidad():
#     try:
#         current_user = get_jwt_identity()
#         especialista = Especialistas.query.filter_by(user_id = current_user).first() 
#         if not especialista: 
#             return jsonify({'error': 'No autorizado'})
#         data = request.json
#         fecha = data.get('fecha')
#         hora_inicio = data.get('hora_inicio')
#         hora_final = data.get('hora_final')

#         credentials = Credentials(data.get("access_token"))
#         service = build("calendar", "v3", credentials=credentials)
        
#         start_time = f"{fecha}T{hora_inicio}:00"
#         end_time = f"{fecha}T{hora_final}:00"

        event_body = {
            "summary": f"Cita con Dr. {medico.user.nombre} {medico.user.apellido}",
            "start": {"dateTime": start_time, "timeZone": "Europe/Madrid"},
            "end": {"dateTime": end_time, "timeZone": "Europe/Madrid"},
            "attendees": [{"email": medico.user.email}]
        }

        event = service.events().insert(calendarId="primary", body=event_body).execute()
        
        nueva_cita = Citas(
            paciente_id=current_user,
            medico_id=medico.id,
            estado='pendiente',
            appointment_date=fecha,
            appointment_time=hora,
            google_event_id=event["id"]
        )
        db.session.add(nueva_cita)
        db.session.commit()

        return jsonify({"msg": "Cita agendada con éxito", "event_id": event["id"]}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@api.route('/citas', methods=['GET'])
@jwt_required()
def list_citas():
    try:
        current_user = get_jwt_identity()
        user = Users.query.get(current_user)

        # Obtener citas de la base de datos
        if user.paciente:
            citas_db = Citas.query.filter_by(paciente_id=current_user).all()
        else:
            citas_db = Citas.query.filter_by(medico_id=current_user).all()
        
        citas_serializadas = [cita.serialize() for cita in citas_db]

       
        access_token = request.headers.get("Authorization").split("Bearer ")[-1]
        credentials = Credentials(access_token)
        service = build("calendar", "v3", credentials=credentials)

       
        now = datetime.now().isoformat() + "Z" 
        events_result = service.events().list(
            calendarId="primary",
            timeMin=now,
            singleEvents=True,
            orderBy="startTime"
        ).execute()

        events = events_result.get("items", [])

        citas_google = []
        for event in events:
            citas_google.append({
                "google_event_id": event.get("id"),
                "summary": event.get("summary"),
                "start": event.get("start").get("dateTime"),
                "end": event.get("end").get("dateTime"),
                "attendees": event.get("attendees", [])
            })

       
        todas_las_citas = citas_serializadas + citas_google

        return jsonify({"msg": "Citas obtenidas exitosamente", "citas": todas_las_citas}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
