const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const GymClass = require('../models/GymClass');

const trainerId = new mongoose.Types.ObjectId();

async function assertValidationError(document, fieldName) {
  await assert.rejects(
    () => document.validate(),
    (error) => error.name === 'ValidationError' && Boolean(error.errors[fieldName])
  );
}

test('GymClass válida con los campos principales', async () => {
  const gymClass = new GymClass({
    title: 'Crossfit avanzado',
    level: 'advanced',
    capacity: 20,
    startsAt: new Date('2026-07-01T10:00:00Z'),
    trainer: trainerId,
  });

  await assert.doesNotReject(() => gymClass.validate());
});

test('GymClass aplica level por defecto', () => {
  const gymClass = new GymClass({
    title: 'Yoga suave',
    capacity: 15,
    startsAt: new Date('2026-07-02T10:00:00Z'),
    trainer: trainerId,
  });

  assert.equal(gymClass.level, 'beginner');
});

test('GymClass aplica duración por defecto', () => {
  const gymClass = new GymClass({
    title: 'Pilates core',
    capacity: 15,
    startsAt: new Date('2026-07-03T10:00:00Z'),
    trainer: trainerId,
  });

  assert.equal(gymClass.durationMinutes, 60);
});

test('GymClass aplica isActive por defecto', () => {
  const gymClass = new GymClass({
    title: 'Boxing cardio',
    capacity: 15,
    startsAt: new Date('2026-07-04T10:00:00Z'),
    trainer: trainerId,
  });

  assert.equal(gymClass.isActive, true);
});

test('GymClass negativo: título demasiado corto', async () => {
  const gymClass = new GymClass({
    title: 'Yo',
    capacity: 15,
    startsAt: new Date('2026-07-05T10:00:00Z'),
    trainer: trainerId,
  });

  await assertValidationError(gymClass, 'title');
});

test('GymClass negativo: capacidad inferior al mínimo', async () => {
  const gymClass = new GymClass({
    title: 'Yoga inicial',
    capacity: 0,
    startsAt: new Date('2026-07-05T10:00:00Z'),
    trainer: trainerId,
  });

  await assertValidationError(gymClass, 'capacity');
});

test('GymClass negativo: nivel fuera del enum', async () => {
  const gymClass = new GymClass({
    title: 'Clase libre',
    level: 'expert',
    capacity: 15,
    startsAt: new Date('2026-07-06T10:00:00Z'),
    trainer: trainerId,
  });

  await assertValidationError(gymClass, 'level');
});
