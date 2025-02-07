from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), unique=False, nullable=False)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    create_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    paciente = db.Column(db.Boolean(), nullable=False)
    

    #relaciones 
    perfil_especialista = db.relationship('Especialistas', backref='users')
    perfil_paciente= db.relationship('Pacientes', backref='users')
    citas = db.relationship('Citas', backref='users')

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


    def __repr__(self):
        return f'<Users {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "create_at": self.create_at,
            "updated_at": self.updated_at,
            "is_active": self.is_active,
            "paciente": self.paciente
            
        }
class Pacientes(db.Model):
    __tablename__ = 'pacientes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    telefono = db.Column(db.String(16))
    direccion = db.Column(db.String(40))
    genero = db.Column(db.String(10))
    fecha_nacimiento = db.Column(db.Date)

    
    def __repr__(self):
        return f'<Pacientes {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "genero": self.genero,
            "fecha_nacimiento": self.fecha_nacimiento            
        }

class Especialistas(db.Model):
    __tablename__ = 'especialistas'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    especialidades = db.Column(db.String(255))
    telefono_oficina = db.Column(db.String(15))
    clinica = db.Column(db.String(15))
    numero_colegiatura= db.Column(db.String(9))
    direccion_centro_trabajo = db.Column(db.String(30))
    descripcion = db.Column(db.String(200))

    #Relacion disponibilidad del medico
    disponibilidad = db.relationship('DisponibilidadMedico', backref='especialistas', lazy=True)
    citas = db.relationship('Citas', backref='especialistas')

    def __repr__(self):
        return f'<Especialistas {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "especialidades": self.especialidades,
            "telefono_oficina": self.telefono_oficina,
            "clinica": self.clinica,
            "numero_colegiatura": self.numero_colegiatura,
            "direccion_centro_trabajo": self.direccion_centro_trabajo,
            "descripcion": self.descripcion            
        }
class DisponibilidadMedico(db.Model):
    __tablename__ = 'disponibilidadMedico'
    id = db.Column(db.Integer, primary_key=True)
    medico_id = db.Column(db.Integer, db.ForeignKey('especialistas.id'), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    hora_inicio = db.Column(db.Time, nullable=False)
    hora_final = db.Column(db.Time, nullable=False)
    is_available = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<DisponibilidadMedico {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "medico_id": self.medico_id,
            "fecha": self.fecha,
            "hora_inicio": self.hora_inicio.strftime('%H:%M'),
            "hora_final": self.hora_final.strftime('%H:%M'),
            "is_available": self.is_available           
        }

class Citas(db.Model):
    __tablename__ = 'citas'
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    medico_id = db.Column(db.Integer, db.ForeignKey('especialistas.id'), nullable=False)
    estado = db.Column(db.Enum('pendiente', 'disponible', 'cancelado', 'completado', name='status_enum',), 
        nullable=False)
    appointment_date = db.Column(db.Date, nullable=False)
    appointment_time = db.Column(db.Time, nullable=False)
    notes = db.Column(db.String(250))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime)
    google_event_id = db.Column(db.String(255), nullable=True)
    
    

    def __repr__(self):
        return f'<Citas {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "paciente_id": self.paciente_id,
            "medico_id": self.medico_id,
            "estado": self.estado,
            "appointment_date": self.appointment_date.isoformat(),
            "appointment_time": self.appointment_time.strftime('%H:%M'),
            "notes": self.notes,
            "created_at": self.created_at, 
            "updated_at": self.updated_at         
        }

#necesita mejoras
class List_Tokens(db.Model):
    __tablename__ = 'list_tokens'
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    toklisted_on = db.Column(db.DateTime, nullable=False)