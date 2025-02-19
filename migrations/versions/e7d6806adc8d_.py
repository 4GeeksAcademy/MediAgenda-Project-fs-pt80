"""empty message

Revision ID: e7d6806adc8d
Revises: 7f18e7990b73
Create Date: 2025-02-14 16:31:50.004070

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e7d6806adc8d'
down_revision = '7f18e7990b73'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('google_refresh_token', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('google_refresh_token')

    # ### end Alembic commands ###
