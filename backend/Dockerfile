FROM python:3.14-rc-bookworm

EXPOSE 5000

WORKDIR /app

COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY . /app

RUN sed -i '1s#.*#JWT_SECRET_KEY=aW3g8Z2e9K@l3n8J5%k0qW8!dR4mZ3j#' /app/.env
RUN sed -i '2s#.*#SQLALCHEMY_DATABASE_URI=mysql+pymysql://root:root@db:3306/delightdb#' /app/.env
RUN sed -i "21s#.*#    smtp_server = 'mailhog'#" /app/routes/status.py

CMD python app.py
