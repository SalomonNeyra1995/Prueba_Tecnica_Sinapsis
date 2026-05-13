const request = require('supertest');
const app = require('../src/app');

describe('Campañas API', () => {
    describe('POST /api/campanas', () => {
        it('debería rechazar datos incompletos', async () => {
            const res = await request(app)
                .post('/api/campanas')
                .send({
                    idUsuario: 1
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it('debería validar que idUsuario sea número', async () => {
            const res = await request(app)
                .post('/api/campanas')
                .send({
                    idUsuario: 'inválido',
                    nombre: 'Campaña Test',
                    fechaHoraProgramacion: '2026-12-25 10:00:00',
                    mensajes: [{ contenido: 'Mensaje test' }]
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it('debería validar que exista al menos un mensaje', async () => {
            const res = await request(app)
                .post('/api/campanas')
                .send({
                    idUsuario: 1,
                    nombre: 'Campaña Test',
                    fechaHoraProgramacion: '2026-12-25 10:00:00',
                    mensajes: []
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it('debería rechazar fecha pasada', async () => {
            const res = await request(app)
                .post('/api/campanas')
                .send({
                    idUsuario: 1,
                    nombre: 'Campaña Test',
                    fechaHoraProgramacion: '2020-01-01 10:00:00',
                    mensajes: [{ contenido: 'Mensaje test' }]
                });
            
            expect(res.statusCode).toBe(400);
        });

        it('debería crear una campaña válida', async () => {
            const res = await request(app)
                .post('/api/campanas')
                .send({
                    idUsuario: 1,
                    nombre: 'Campaña Válida',
                    fechaHoraProgramacion: '2027-12-25 10:00:00',
                    mensajes: [
                        { contenido: 'Mensaje de prueba 1' },
                        { contenido: 'Mensaje de prueba 2' }
                    ]
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.idCampania).toBeDefined();
            expect(res.body.message).toBeDefined();
        });
    });
});
