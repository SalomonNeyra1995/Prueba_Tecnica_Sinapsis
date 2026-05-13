const request = require('supertest');
const app = require('../src/app');

describe('Reportes API', () => {
    describe('GET /api/reportes/mensajes', () => {
        it('debería requerir el parámetro mes', async () => {
            const res = await request(app)
                .get('/api/reportes/mensajes');
            
            expect(res.statusCode).toBe(400);
            // Tu API puede devolver error o errors
            expect(res.body.error || res.body.errors).toBeDefined();
        });

        it('debería aceptar formato de mes válido', async () => {
            const res = await request(app)
                .get('/api/reportes/mensajes?mes=2025-11');
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('debería rechazar formato de mes inválido', async () => {
            const res = await request(app)
                .get('/api/reportes/mensajes?mes=2025/11');
            
            expect(res.statusCode).toBe(400);
            expect(res.body.error || res.body.errors).toBeDefined();
        });

        it('debería filtrar por cliente_id opcional', async () => {
            const res = await request(app)
                .get('/api/reportes/mensajes?mes=2025-11&cliente_id=1');
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
});