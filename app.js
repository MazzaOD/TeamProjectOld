// app.mjs
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import expressHandlebars from 'express-handlebars';
import * as dentistDB from './dentistDB.js'; // Change the import to your dentist database functions

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;

const hbs = expressHandlebars.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home page - List dentists
app.get('/', async (req, res) => {
  try {
    const dentists = await dentistDB.getAllDentists();
    res.render('index', { dentists });
  } catch (error) {
    console.error('Error fetching dentists:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Dentist details page
app.get('/dentist/:id', async (req, res) => {
  const dentistId = req.params.id;
  try {
    const dentist = await dentistDB.getDentistDetails(dentistId);
    if (!dentist) {
      res.status(404).send('Dentist not found');
      return;
    }
    res.render('dentistDetails', { dentist });
  } catch (error) {
    console.error('Error fetching dentist details:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for showing the form to schedule an appointment
app.get('/schedule/:id', async (req, res) => {
  const dentistId = req.params.id;
  try {
    const dentist = await dentistDB.getDentistDetails(dentistId);
    if (!dentist) {
      res.status(404).send('Dentist not found');
      return;
    }
    res.render('scheduleAppointment', { dentist });
  } catch (error) {
    console.error('Error fetching dentist details:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for showing the form to add a new treatment
app.get('/add-treatment', (req, res) => {
  res.render('addTreatment');
});

app.post('/add-treatment', async (req, res) => {
  try {
    const { name, description } = req.body;
    const treatment = {
      name,
      description,
    };
    await dentistDB.createTreatment(treatment);
    res.redirect('/');
  } catch (error) {
    console.error('Error adding treatment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for showing the form to add a new appointment
app.get('/add-appointment', async (req, res) => {
  try {
    const dentists = await dentistDB.getAllDentists();
    const clients = await dentistDB.getAllClients();
    const treatments = await dentistDB.getAllTreatments();
    res.render('addAppointment', { dentists, clients, treatments });
  } catch (error) {
    console.error('Error fetching data for appointment form:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add-appointment', async (req, res) => {
  try {
    const { dentistId, clientId, treatmentId, date, time } = req.body;
    const appointment = {
      dentistId,
      clientId,
      treatmentId,
      date,
      time,
    };
    await dentistDB.createAppointment(appointment);
    res.redirect('/');
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for viewing the appointment schedule
app.get('/schedule', async (req, res) => {
  try {
    const appointments = await dentistDB.getAllAppointmentsWithDetails();
    res.render('appointmentSchedule', { appointments });
  } catch (error) {
    console.error('Error fetching appointment schedule:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for showing the form to add a new client
app.get('/add-client', (req, res) => {
  res.render('addClient');
});

app.post('/add-client', async (req, res) => {
  try {
    const { name, email } = req.body;
    const client = {
      name,
      email,
    };
    await dentistDB.createClient(client);
    res.redirect('/');
  } catch (error) {
    console.error('Error adding client:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for adding a treatment form
app.get('/add-treatment', (req, res) => {
  res.render('addTreatment');
});

// Route for handling treatment form submission
app.post('/add-treatment', async (req, res) => {
  try {
      const { name, description } = req.body;
      const treatment = { name, description };
      await dentistDB.addTreatment(treatment);
      res.redirect('/');
  } catch (error) {
      console.error('Error adding treatment:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Route for adding an appointment form
app.get('/add-appointment', async (req, res) => {
  try {
      const dentists = await dentistDB.getAllDentists();
      const clients = await dentistDB.getAllClients();
      const treatments = await dentistDB.getAllTreatments();
      res.render('addAppointment', { dentists, clients, treatments });
  } catch (error) {
      console.error('Error fetching data for appointment form:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Route for handling appointment form submission
app.post('/add-appointment', async (req, res) => {
  try {
      const { dentistId, clientId, treatmentId, date, time } = req.body;
      const appointment = { dentistId, clientId, treatmentId, date, time };
      await dentistDB.addAppointment(appointment);
      res.redirect('/');
  } catch (error) {
      console.error('Error adding appointment:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Route for adding a client form
app.get('/add-client', (req, res) => {
  res.render('addClient');
});

// Route for handling client form submission
app.post('/add-client', async (req, res) => {
  try {
      const { name, email } = req.body;
      const client = { name, email };
      await dentistDB.addClient(client);
      res.redirect('/');
  } catch (error) {
      console.error('Error adding client:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Route for viewing the appointment schedule
app.get('/schedule', async (req, res) => {
  try {
      const appointments = await dentistDB.getAllAppointmentsWithDetails();
      res.render('appointmentSchedule', { appointments });
  } catch (error) {
      console.error('Error fetching appointment schedule:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/schedule/:id', async (req, res) => {
  const dentistId = req.params.id;
  try {
    const { patientName, date, time } = req.body;
    const appointment = {
      dentistId,
      patientName,
      date,
      time,
    };
    await dentistDB.scheduleAppointment(appointment);
    res.redirect(`/dentist/${dentistId}`);
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Other routes for CRUD operations on dentists, appointments, etc.

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
