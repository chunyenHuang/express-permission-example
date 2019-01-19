const request = require('supertest');
const app = require('./app');

describe('App Test', () => {
    test('get user without fake token', (done) => {
        request(app)
            .get('/user/my-user-id')
            .expect(401)
            .end((err, res) => {
                if (err) {
                    throw err;
                } else {
                    expect(res.body.message).toBe('Your token is invalid or has expired.');
                    done();
                }
            });
    });

    test('get other user for ownOnly permission', (done) => {
        request(app)
            .get('/user/my-admin-id?token=customer-token')
            .expect(403)
            .end((err, res) => {
                if (err) {
                    throw err;
                } else {
                    expect(res.body.message).toBe('You are not authorized to perform actions on this user.');

                    done();
                }
            });
    });

    test('get user', (done) => {
        request(app)
            .get('/user/my-user-id?token=customer-token')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw err;
                } else {
                    expect(res.body.id).toBe('my-user-id');
                    expect(res.body.role).toBe('customer');
                    expect(res.body.permission.isDisabled).toBe(false);
                    // console.log(res.body);

                    done();
                }
            });
    });

    test('delete user (no mapped permission)', (done) => {
        request(app)
            .delete('/user/my-user-id?token=customer-token')
            .expect(403)
            .end((err, res) => {
                if (err) {
                    throw err;
                } else {
                    expect(res.body.message).toBe('You are not authorized.');

                    done();
                }
            });
    });
});