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

#         event_body = {
#             "summary": "Disponibilidad del Médico",
#             "description": f"El Dr. {especialista.user.nombre} {especialista.user.apellido} está disponible en este horario.",
#             "start": {"dateTime": start_time, "timeZone": "Etc/GMT"},
#             "end": {"dateTime": end_time, "timeZone": "Etc/GMT"},
#             "transparency": "transparent",  
#             "visibility": "public",
#         }
#         calendar = service.calendars().insert(calendarId="primary", body=event_body).execute()

#         nueva_disponibilidad = DisponibilidadMedico(
#             medico_id= especialista.id,
#             fecha= data['fecha'],
#             hora_inicio= hora_inicio,
#             hora_final= hora_final,
#             is_available= True,
#             google_event_id=calendar["id"]
#         )
#         db.session.add(nueva_disponibilidad)
#         db.session.commit()

#         return jsonify({"msg": "Disponibilidad creada exitosamente"}), 201

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500

# @api.route('/disponibilidad/<int:id>', methods=['PUT'])
# @jwt_required()
# def actualizar_disponibilidad(id):
#     try:
#         current_user = get_jwt_identity()
#         especialista = Especialistas.query.filter_by(user_id=current_user).first()
#         if not especialista:
#             return jsonify({'error': 'No autorizado'})

#         disponibilidad = DisponibilidadMedico.query.get(id)
#         if not disponibilidad or disponibilidad.medico_id != especialista.id:
#             return jsonify({'error': 'Disponibilidad no encontrada'}), 404

#         data = request.json
#         fecha = data.get('fecha')
#         hora_inicio = data.get('hora_inicio')
#         hora_final = data.get('hora_final')

        
#         disponibilidad.fecha = fecha
#         disponibilidad.hora_inicio = hora_inicio
#         disponibilidad.hora_final = hora_final
#         db.session.commit()

       
#         if disponibilidad.google_event_id:
#             credentials = Credentials(data.get("access_token"))
#             service = build("calendar", "v3", credentials=credentials)

#             start_time = f"{fecha}T{hora_inicio}:00"
#             end_time = f"{fecha}T{hora_final}:00"

#             event_body = {
#                 "summary": "Disponibilidad del Médico",
#                 "description": f"El Dr. {especialista.user.nombre} {especialista.user.apellido} ha actualizado su disponibilidad.",
#                 "start": {"dateTime": start_time, "timeZone": "Etc/GMT"},
#                 "end": {"dateTime": end_time, "timeZone": "Etc/GMT"},
#                 "transparency": "transparent",
#                 "visibility": "public",
#             }

#             updated_event = service.events().update(
#                 calendarId="primary", eventId=disponibilidad.google_event_id, body=event_body
#             ).execute()

#             return jsonify({"msg": "Disponibilidad actualizada con éxito", "event": updated_event}), 200

#         return jsonify({"msg": "Disponibilidad actualizada en la base de datos"}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500

# @api.route('/disponibilidad/<int:id>', methods=['DELETE'])
# @jwt_required()
# def eliminar_disponibilidad(id):
#     try:
#         current_user = get_jwt_identity()
#         especialista = Especialistas.query.filter_by(user_id=current_user).first()
#         if not especialista:
#             return jsonify({'error': 'No autorizado'})

#         disponibilidad = DisponibilidadMedico.query.get(id)
#         if not disponibilidad or disponibilidad.medico_id != especialista.id:
#             return jsonify({'error': 'Disponibilidad no encontrada'}), 404

       
#         if disponibilidad.google_event_id:
#             credentials = Credentials(request.json.get("access_token"))
#             service = build("calendar", "v3", credentials=credentials)

#             service.events().delete(calendarId="primary", eventId=disponibilidad.google_event_id).execute()

        
#         db.session.delete(disponibilidad)
#         db.session.commit()

#         return jsonify({"msg": "Disponibilidad eliminada con éxito"}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500


# @api.route('/citas', methods=['POST'])
# @jwt_required()
# def agendar_cita():
#     try:
#         current_user = get_jwt_identity()
        
#         data = request.json
#         medico = Especialistas.query.get(data.get('medico_id'))
#         fecha = data.get('appointment_date')
#         hora = data.get('appointment_time')

#         credentials = Credentials(data.get("access_token"))
#         service = build("calendar", "v3", credentials=credentials)
#         start_time = f"{fecha}T{hora}:00"
#         end_time = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S") + timedelta(hours=1)

#         event_body = {
#             "summary": f"Cita con {medico.user.nombre} {medico.user.apellido}",
#             "start": {"dateTime": start_time, "timeZone": "Etc/GMT"},
#             "end": {"dateTime": end_time.isoformat(), "timeZone": "Etc/GMT"},
#             "attendees": [{"email": medico.user.email}, {"email": current_user.user.email}],
#         }
#         calendar = service.calendars().insert(calendarId="primary", body=event_body).execute()

#         nueva_cita = Citas(
#             paciente_id=current_user, 
#             medico_id=data.get('medico_id'),
#             estado='pendiente',
#             appointment_date=fecha,
#             appointment_time=hora,
#             notes=data.get('notes', ''),
#             google_event_id=calendar["id"]
#         )
#         db.session.add(nueva_cita)
#         db.session.commit()

#         return jsonify({"msg": "Cita agendada exitosamente", }), 201

#     except Exception as e:
#         db.session.rollback()
#         print("Error al agendar cita:", str(e)) 
#         return jsonify({"error": str(e)}), 500


# @api.route('/citas', methods=['GET'])
# @jwt_required()
# def list_citas():
#     try:
#         current_user = get_jwt_identity()

#         if current_user:
#             citas = Citas.query.filter_by(paciente_id=current_user).all()
#         else:
#             citas = Citas.query.filter_by(medico_id=current_user['medico_id']).all()

#         return jsonify([cita.serialize() for cita in citas]), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @api.route('/citas/actualizar/<int:id>', methods=['PUT'])
# @jwt_required()
# def actualizar_cita(id):
#     try:
#         current_user = get_jwt_identity()
#         cita = Citas.query.get(id)

#         if not cita or cita.paciente_id != current_user:
#             return jsonify({"error": "No autorizado"}), 403

#         data = request.json
#         nueva_fecha = data.get('fecha', cita.appointment_date)
#         nueva_hora = data.get('hora', cita.appointment_time)

     
#         credentials = Credentials(request.json.get("access_token"))
#         service = build("calendar", "v3", credentials=credentials)
#         start_time = f"{nueva_fecha}T{nueva_hora}:00"
#         end_time = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S") + timedelta(hours=1)

#         event_body = {
#             "start": {"dateTime": start_time, "timeZone": "Etc/GMT"},
#             "end": {"dateTime": end_time.isoformat(), "timeZone": "Etc/GMT"},
#         }
#         service.events().update(calendarId="primary", eventId=cita.google_event_id, body=event_body).execute()

#         cita.appointment_date = nueva_fecha
#         cita.appointment_time = nueva_hora
#         db.session.commit()
#         return jsonify({"msg": "Cita actualizada exitosamente"}), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @api.route('/citas/cancelar/<int:id>', methods=['DELETE'])
# @jwt_required()
# def cancelar_cita(id):
#     try:
#         current_user = get_jwt_identity()
#         cita = Citas.query.get(id)

#         if not cita or cita.paciente_id != current_user:
#             return jsonify({"error": "No autorizado"}), 403

       
#         credentials = Credentials(request.json.get("access_token"))
#         service = build("calendar", "v3", credentials=credentials)
#         service.events().delete(calendarId="primary", eventId=cita.google_event_id).execute()

#         db.session.delete(cita)
#         db.session.commit()
#         return jsonify({"msg": "Cita cancelada exitosamente"}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500
    



