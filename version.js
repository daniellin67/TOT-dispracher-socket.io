const options = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '123',
        database: 'test'
    }
}
const knex = require('knex')(options);
const cars = [
    { fullname: 'Daniel Lin',
    phone_client: '0337221511',
    destination: '227, Nguyễn Văn Cừ, quận 5, thành phố Hồ Chí Minh' }
]

knex('agency').where('username','lamcuongdat').andWhere('password','123').first().then(function(row){
    console.log(row)
})
