from wsgiref.simple_server import make_server
from pyramid.config import Configurator
import jwt
import pymysql
from pyramid.view import view_config


#productbase koneksi ke mysql
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    db='fruit',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

def auth_jwt_verify(request):
    authentication_header = request.cookies.get('token')
    if authentication_header:
        try:
            decoded_user = jwt.decode(
                authentication_header, 'secret', algorithms=['HS256'])
            with connection.cursor() as cursor:
                sql = "SELECT jwt_token FROM tokens WHERE user_id=%s"
                cursor.execute(sql, (decoded_user['sub'],))
                result = cursor.fetchone()
            if result:
                return decoded_user
        except jwt.ExpiredSignatureError:
            request.response.status = 401  
    return None


# endpoint untk productList yang digunakan untuk membaca product 

@view_config(route_name='productList', renderer="json", request_method="GET")
def productList(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        with connection.cursor() as cursor:
            sql = "SELECT id,name,rating,description,price FROM fruit WHERE user_id=%s"
            cursor.execute(sql, (auth_user['sub'],))
            result = cursor.fetchall()

        product = {}
        for item in result:
            product[item['id']] = {
                'id': item['id'],
                'name': item['name'],
                'rating': item['rating'],
                'description': item['description'],
                'price': item['price'],
            }
        return {
            'message': 'oke',
            'description': 'product berhasil anda buat!',
            'product': product
        }
    else:
        request.response.status = 401  # tidak ditemukan
        return {'message': 'Unauthorized', 'description': 'token not found'}


# endpoint membuat product  fruit
@view_config(route_name='create-product', request_method='POST', renderer="json")
def fruit_create(request):
    
    auth_user = auth_jwt_verify(request)
    if auth_user:
        with connection.cursor() as cursor:
            sql = "INSERT INTO fruit (name, rating, description,price) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (request.POST['name'], request.POST['rating'],request.POST['description'],request.POST['price'], auth_user['sub'],))
            connection.commit()
        return {'message': 'ok', 'description': 'berhasil buat product ', 'product': [request.POST['name'], request.POST['rating'],request.POST['description']request.POST['price']]}
    else:
        request.response.status = 401
        return {'message': 'Unauthorized', 'description': 'token tidak ditemukan'}


# endpoint update-product
@view_config(route_name='update-product', request_method='PUT', renderer="json")
def fruit_update(request):
  
    auth_user = auth_jwt_verify(request)
    if auth_user:
        with connection.cursor() as cursor:
            sql = "UPDATE fruit SET name=%s, rating=%s, description,price=%s WHERE id=%s"
            cursor.execute(sql, (request.POST['name'], request.POST['rating'],
                           request.POST['description'],request.POST['price'],, auth_user['sub'], request.POST['id']))
            connection.commit()
            return {'message': 'ok', 'description': 'product berhasil anda buat', 'product': [request.POST['name'], request.POST['rating'],request.POST['description']request.POST['price'],]}
    else:
        request.response.status = 401
        return {'message': 'Unauthorized', 'description': 'token tidak ditemukan'}


# endpoint delete product
@view_config(route_name='delete-product', request_method='DELETE', renderer="json")
def fruit_delete(request):

    auth_user = auth_jwt_verify(request)
    if auth_user:
        with connection.cursor() as cursor:
            sql = "SELECT id,name,rating,description,price FROM fruit WHERE user_id=%s"
            cursor.execute(sql, (auth_user['sub'],))
            result = cursor.fetchall()
            product = {}
            for item in result:
                product = {
                'id': item['id'],
                'name': item['name'],
                'rating': item['rating'],
                'description': item['description'],
                'price': item['price'],
                }
            sql = "DELETE FROM fruit WHERE id=%s"
            cursor.execute(sql, (request.POST['id']))
            connection.commit()
        return {'message': 'ok', 'description': 'hapus product berhasil', 'product': product}
    else:
        request.response.status = 401
        return {'message': 'Unauthorized', 'description': 'token tidak ditemukan'}


if __name__ == "__main__":
    with Configurator() as config:
        config = Configurator(settings={'jwt.secret': 'secret'})

        # mengkonfigurasi endpoint yang akan dipakai
        config.add_route('index', '/')
        config.add_route('productList', '/productList')
        config.add_route('create-product', '/create')
        config.add_route('update-product', '/update')
        config.add_route('delete-product', '/delete')
        config.scan()
        app = config.make_wsgi_app()

    # run apk to local server
    server = make_server('0.0.0.0', 6543, app)
    server.serve_forever()