const request = require('supertest');
const app = require('../src/app');

describe('Campañas API', () => {
    describe('POST /api/campanas', () => {
        it('debería rechazar datos incompletos', async () => {
            const res = await request(app)
                .post('/api/campanas')
                .send({
                    cliente_id: 1
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it('debería validar que cliente_id sea número', async () => {
            const res = await request(app)
                .post('/api/campanas')
                .send({
                    cliente_id: 'inválido',
                    nombre: 'Campaña Test',
                    fecha_programacion: '2025-12-25',
                    mensajes: [{ contenido: 'Mensaje test' }]
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it('debería validar que exista al menos un mensaje', async () => {
            const res = await request(app)
                .post('/api/campanas')
                .send({
                    cliente_id: 1,
                    nombre: 'Campaña Test',
                    fecha_programacion: '2025-12-25',
                    mensajes: []
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it('debería rechazar fecha pasada', async () => {
            const res = await request(app)
                .post('/api/campanas')
                .send({
                    cliente_id: 1,
                    nombre: 'Campaña Test',
                    fecha_programacion: '2020-01-01',
                    mensajes: [{ contenido: 'Mensaje test' }]
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.error || res.body.errors).toBeDefined();
        });

        it('debería crear una campaña válida', async () => {
            const res = await request(app)
                .post('/api/campanas')
                .send({
                    cliente_id: 1,
                    nombre: 'Campaña Válida',
                    fecha_programacion: '2026-12-25',
                    mensajes: [
                        { contenido: 'Mensaje de prueba 1' },
                        { contenido: 'Mensaje de prueba 2' }
                    ]
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.campana_id).toBeDefined();
            expect(res.body.message).toBeDefined();
        });
    });
});