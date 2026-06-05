const test = require('node:test');
const assert = require('node:assert/strict');
const Trainer = require('../models/Trainer');

async function assertValidationError(document, fieldName) {
  await assert.rejects(
    () => document.validate(),
    (error) => error.name === 'ValidationError' && Boolean(error.errors[fieldName])
  );
}

test('Trainer válido con todos los campos obligatorios', async () => {
  const trainer = new Trainer({
    name: 'Laura Martín',
    specialty: 'fitness',
    experienceYears: 8,
  });

  await assert.doesNotReject(() => trainer.validate());
});

test('Trainer aplica available por defecto a true', () => {
  const trainer = new Trainer({
    name: 'Carlos Ruiz',
    specialty: 'boxing',
    experienceYears: 5,
  });

  assert.equal(trainer.available, true);
});

test('Trainer aplica hiredAt por defecto', () => {
  const trainer = new Trainer({
    name: 'Marta León',
    specialty: 'yoga',
    experienceYears: 3,
  });

  assert.ok(trainer.hiredAt instanceof Date);
});

test('Trainer negativo: nombre demasiado corto', async () => {
  const trainer = new Trainer({ name: 'Al', specialty: 'fitness', experienceYears: 2 });
  await assertValidationError(trainer, 'name');
});

test('Trainer negativo: especialidad fuera del enum', async () => {
  const trainer = new Trainer({ name: 'Pedro Gómez', specialty: 'natacion', experienceYears: 2 });
  await assertValidationError(trainer, 'specialty');
});

test('Trainer negativo: experiencia superior al máximo', async () => {
  const trainer = new Trainer({ name: 'Ana Pérez', specialty: 'pilates', experienceYears: 80 });
  await assertValidationError(trainer, 'experienceYears');
});
