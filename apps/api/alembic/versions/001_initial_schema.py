"""initial schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-07-20 18:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Projects table
    op.create_table(
        'projects',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('owner_id', sa.String(length=36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug')
    )
    op.create_index(op.f('ix_projects_slug'), 'projects', ['slug'], unique=True)

    # Project Members table
    op.create_table(
        'project_members',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('project_id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('project_id', 'user_id', name='uq_project_user')
    )

    # Project API Keys table
    op.create_table(
        'project_api_keys',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('project_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('key_prefix', sa.String(length=16), nullable=False),
        sa.Column('key_hash', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_used_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('key_hash')
    )

    # Usage Events table
    op.create_table(
        'usage_events',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('project_id', sa.String(length=36), nullable=False),
        sa.Column('event_id', sa.String(length=255), nullable=False),
        sa.Column('time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('model', sa.String(length=100), nullable=False),
        sa.Column('endpoint', sa.String(length=100), nullable=True),
        sa.Column('input_tokens', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('output_tokens', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('cached_input_tokens', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('reasoning_tokens', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('cost_usd', sa.Numeric(precision=14, scale=8), nullable=True),
        sa.Column('cost_reason', sa.String(length=100), nullable=True),
        sa.Column('latency_ms', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('status_code', sa.Integer(), nullable=False, server_default='200'),
        sa.Column('request_id', sa.String(length=255), nullable=True),
        sa.Column('metadata_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('project_id', 'event_id', name='uq_project_event')
    )
    op.create_index('idx_events_project_time', 'usage_events', ['project_id', 'time'])
    op.create_index('idx_events_project_provider_model', 'usage_events', ['project_id', 'provider', 'model'])

    # Pricing Rates table
    op.create_table(
        'pricing_rates',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('model', sa.String(length=100), nullable=False),
        sa.Column('model_pattern', sa.String(length=100), nullable=True),
        sa.Column('input_cost_per_1k', sa.Numeric(precision=14, scale=8), nullable=False),
        sa.Column('output_cost_per_1k', sa.Numeric(precision=14, scale=8), nullable=False),
        sa.Column('cache_read_cost_per_1k', sa.Numeric(precision=14, scale=8), nullable=False),
        sa.Column('reasoning_cost_per_1k', sa.Numeric(precision=14, scale=8), nullable=False),
        sa.Column('currency', sa.String(length=10), nullable=False, server_default='USD'),
        sa.Column('source_url', sa.String(length=500), nullable=True),
        sa.Column('effective_from', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_deprecated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('provider', 'model', 'effective_from', name='uq_provider_model_effective')
    )

    # Budgets table
    op.create_table(
        'budgets',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('project_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('amount_usd', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('period', sa.String(length=50), nullable=False, server_default='monthly'),
        sa.Column('metric', sa.String(length=50), nullable=False, server_default='spend'),
        sa.Column('thresholds_json', sa.JSON(), nullable=False),
        sa.Column('destinations_json', sa.JSON(), nullable=False),
        sa.Column('quiet_hours_json', sa.JSON(), nullable=True),
        sa.Column('cool_down_minutes', sa.Integer(), nullable=False, server_default='60'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Alert Deliveries table
    op.create_table(
        'alert_deliveries',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('project_id', sa.String(length=36), nullable=False),
        sa.Column('budget_id', sa.String(length=36), nullable=True),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('threshold_percent', sa.Integer(), nullable=True),
        sa.Column('severity', sa.String(length=20), nullable=False, server_default='warning'),
        sa.Column('observed_value', sa.Numeric(precision=14, scale=4), nullable=False),
        sa.Column('limit_value', sa.Numeric(precision=14, scale=4), nullable=False),
        sa.Column('period_start', sa.DateTime(timezone=True), nullable=False),
        sa.Column('period_end', sa.DateTime(timezone=True), nullable=False),
        sa.Column('destination_type', sa.String(length=50), nullable=False),
        sa.Column('destination_target', sa.String(length=500), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='sent'),
        sa.Column('payload_json', sa.JSON(), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('delivered_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['budget_id'], ['budgets.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )

    # Audit Logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('project_id', sa.String(length=36), nullable=True),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('action', sa.String(length=100), nullable=False),
        sa.Column('resource_type', sa.String(length=100), nullable=False),
        sa.Column('resource_id', sa.String(length=255), nullable=True),
        sa.Column('details_json', sa.JSON(), nullable=True),
        sa.Column('ip_address', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('alert_deliveries')
    op.drop_table('budgets')
    op.drop_table('pricing_rates')
    op.drop_table('usage_events')
    op.drop_table('project_api_keys')
    op.drop_table('project_members')
    op.drop_table('projects')
    op.drop_table('users')
