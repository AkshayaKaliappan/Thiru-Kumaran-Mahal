
"""
Django Settings for Thiru Kumaran Mahal Function Hall Booking System.
Production-ready configuration for Vercel and Aiven MySQL.
"""

import os
import sys
from pathlib import Path
from datetime import timedelta

import dj_database_url
from decouple import config, Csv


# ====================
# BASE DIRECTORY
# ====================

BASE_DIR = Path(__file__).resolve().parent.parent


# ====================
# SECURITY
# ====================

SECRET_KEY = config(
    'SECRET_KEY',
    default='dev-secret-key-change-this'
)

DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='localhost,127.0.0.1',
    cast=Csv()
)


# ====================
# APPLICATION DEFINITION
# ====================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',

    # Local apps
    'users',
    'bookings',
    'expenses',
    'reports',
]


# ====================
# MIDDLEWARE
# ====================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'config.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'config.wsgi.application'


# ====================
# DATABASE - AIVEN MYSQL
# ====================

AIVEN_CA_CERT = config('AIVEN_CA_CERT', default='')

AIVEN_CA_PATH = None

if AIVEN_CA_CERT:
    AIVEN_CA_PATH = Path('/tmp/aiven-ca.pem')

    AIVEN_CA_PATH.write_text(
        AIVEN_CA_CERT.replace('\\n', '\n')
    )


MYSQL_OPTIONS = {
    'charset': 'utf8mb4',
    'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
}

if AIVEN_CA_PATH:
    MYSQL_OPTIONS['ssl'] = {
        'ca': str(AIVEN_CA_PATH)
    }


DATABASE_URL = config('DATABASE_URL', default=None)

if DATABASE_URL:

    DATABASES = {
        'default': dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=0
        )
    }

    if 'mysql' in DATABASES['default']['ENGINE']:
        DATABASES['default']['OPTIONS'] = MYSQL_OPTIONS
        DATABASES['default']['CONN_MAX_AGE'] = 0

else:

    DB_ENGINE = config(
        'DB_ENGINE',
        default='django.db.backends.mysql'
    )

    DB_CONFIG = {
        'ENGINE': DB_ENGINE,
        'NAME': config('DB_NAME', default='thiru_kumaran_mahal'),
        'USER': config('DB_USER', default='root'),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='3306'),
        'CONN_MAX_AGE': 0,
    }

    if 'mysql' in DB_ENGINE:
        DB_CONFIG['OPTIONS'] = MYSQL_OPTIONS

    DATABASES = {
        'default': DB_CONFIG
    }


# SQLite for tests

if 'test' in sys.argv:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }


# ====================
# AUTH PASSWORD VALIDATION
# ====================

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 8}
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'
    },
]


# ====================
# INTERNATIONALIZATION
# ====================

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_TZ = True


# ====================
# STATIC FILES
# ====================

STATIC_URL = '/static/'

STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_STORAGE = (
    'whitenoise.storage.CompressedManifestStaticFilesStorage'
)


# ====================
# DEFAULT PRIMARY KEY
# ====================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ====================
# DJANGO REST FRAMEWORK
# ====================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],

    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],

    'DEFAULT_PAGINATION_CLASS': (
        'rest_framework.pagination.PageNumberPagination'
    ),

    'PAGE_SIZE': 20,

    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}


# ====================
# JWT CONFIGURATION
# ====================

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),

    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),

    'ROTATE_REFRESH_TOKENS': True,

    'BLACKLIST_AFTER_ROTATION': True,

    'UPDATE_LAST_LOGIN': True,

    'ALGORITHM': 'HS256',

    'AUTH_HEADER_TYPES': ('Bearer',),

    'USER_ID_FIELD': 'id',

    'USER_ID_CLAIM': 'user_id',
}


# ====================
# CORS CONFIGURATION
# ====================

CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173,http://localhost:3000',
    cast=Csv()
)

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_ALL_ORIGINS = config(
    'CORS_ALLOW_ALL_ORIGINS',
    default=False,
    cast=bool
)

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]


# ====================
# PRODUCTION SECURITY SETTINGS
# ====================

if not DEBUG:

    SECURE_BROWSER_XSS_FILTER = True

    SECURE_CONTENT_TYPE_NOSNIFF = True

    SECURE_SSL_REDIRECT = config(
        'SECURE_SSL_REDIRECT',
        default=True,
        cast=bool
    )

    SESSION_COOKIE_SECURE = True

    CSRF_COOKIE_SECURE = True

    SECURE_HSTS_SECONDS = 31536000

    SECURE_HSTS_INCLUDE_SUBDOMAINS = True

    SECURE_HSTS_PRELOAD = True

    # HTTPS proxy handling
    SECURE_PROXY_SSL_HEADER = (
        'HTTP_X_FORWARDED_PROTO',
        'https'
    )

    USE_X_FORWARDED_HOST = True


# ====================
# LOGGING
# ====================

LOGGING = {
    'version': 1,

    'disable_existing_loggers': False,

    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },

    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },

    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO' if DEBUG else 'WARNING',
            'propagate': False,
        },
    },
}
