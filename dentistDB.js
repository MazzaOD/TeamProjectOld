import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('dentists.sqlite');

// Initialize the dentists table
db.serialize(() => {
    db.run('DROP TABLE IF EXISTS dentists');
    db.run('CREATE TABLE dentists (name TEXT, specialty TEXT, image TEXT)');

    // You can add initial dentist data here if needed.
    // For example:
    const dentistsData = [
        ['Dr. Smith', 'Orthodontist', 'dr_smith.jpg'],
        ['Dr. Johnson', 'Periodontist', 'dr_johnson.jpg'],
        // ... other dentists
    ];

    // Treatments table
    db.run('DROP TABLE IF EXISTS treatments');
    db.run('CREATE TABLE treatments (name TEXT, description TEXT)');

    // Example treatments data
    const treatmentsData = [
        ['Teeth Cleaning', 'Routine cleaning for maintaining oral health'],
        ['Cavity Filling', 'Treatment for filling cavities and preventing decay'],
        ['Braces Installation', 'Orthodontic treatment for teeth alignment'],
        // ... add more treatments
    ];

    const treatmentStmt = db.prepare('INSERT INTO treatments VALUES (?,?)');
    treatmentsData.forEach((treatment) => {
        treatmentStmt.run(...treatment);
    });
    treatmentStmt.finalize();

    // Appointments table
    db.run('DROP TABLE IF EXISTS appointments');
    db.run('CREATE TABLE appointments (dentistId INTEGER, clientId INTEGER, treatmentId INTEGER, date TEXT, time TEXT)');

    // Example appointments data
    const appointmentsData = [
        [1, 1, 1, '2024-02-15', '10:00 AM'],
        [2, 2, 2, '2024-02-16', '02:30 PM'],
        [3, 3, 3, '2024-02-17', '11:45 AM'],
        // ... add more appointments
    ];

    const appointmentStmt = db.prepare('INSERT INTO appointments VALUES (?,?,?,?,?)');
    appointmentsData.forEach((appointment) => {
        appointmentStmt.run(...appointment);
    });
    appointmentStmt.finalize();

    // Clients table
    db.run('DROP TABLE IF EXISTS clients');
    db.run('CREATE TABLE clients (name TEXT, email TEXT)');

    // Example clients data
    const clientsData = [
        ['John Doe', 'john@example.com'],
        ['Jane Smith', 'jane@example.com'],
        ['Mike Johnson', 'mike@example.com'],
        // ... add more clients
    ];

    const clientStmt = db.prepare('INSERT INTO clients VALUES (?,?)');
    clientsData.forEach((client) => {
        clientStmt.run(...client);
    });
    clientStmt.finalize();

    const stmt = db.prepare('INSERT INTO dentists VALUES (?,?,?)');
    dentistsData.forEach((dentist) => {
        stmt.run(...dentist);
    });
    stmt.finalize();
});

// Function to get all dentists
export function getAllDentists() {
    return new Promise((resolve, reject) => {
        db.all('SELECT rowid AS id, * FROM dentists', (err, dentists) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(dentists);
        });
    });
}

// Function to get dentist details by ID
export function getDentistDetails(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM dentists WHERE rowid = ?', [id], (err, dentist) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(dentist);
        });
    });
}

// Function to create a new dentist
export function createDentist(dentist) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO dentists VALUES (?,?,?)');
        stmt.run(
            dentist.name,
            dentist.specialty,
            dentist.image,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to update a dentist by ID
export function updateDentist(id, updatedDentist) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(
            'UPDATE dentists SET name=?, specialty=?, image=? WHERE rowid=?'
        );
        stmt.run(
            updatedDentist.name,
            updatedDentist.specialty,
            updatedDentist.image,
            id,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to delete a dentist by ID
export function deleteDentist(id) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('DELETE FROM dentists WHERE rowid=?');
        stmt.run(id, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
        stmt.finalize();
    });
}

// Function to close the database connection
export function closeDB() {
    return new Promise((resolve) => {
        db.close(() => {
            resolve();
        });
    });
}

// dentistDB.js

// ... (existing code)

// Function to get all treatments
export function getAllTreatments() {
    return new Promise((resolve, reject) => {
        db.all('SELECT rowid AS id, * FROM treatments', (err, treatments) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(treatments);
        });
    });
}

// Function to create a new treatment
export function createTreatment(treatment) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO treatments VALUES (?,?)');
        stmt.run(
            treatment.name,
            treatment.description,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to get all appointments
export function getAllAppointments() {
    return new Promise((resolve, reject) => {
        db.all('SELECT rowid AS id, * FROM appointments', (err, appointments) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(appointments);
        });
    });
}

// Function to create a new appointment
export function createAppointment(appointment) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO appointments VALUES (?,?,?,?,?)');
        stmt.run(
            appointment.dentistId,
            appointment.clientId,
            appointment.treatmentId,
            appointment.date,
            appointment.time,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// Function to get all appointments with details
export function getAllAppointmentsWithDetails() {
    return new Promise((resolve, reject) => {
        db.all('SELECT appointments.rowid AS id, dentists.name AS dentistName, clients.name AS clientName, treatments.name AS treatmentName, appointments.date, appointments.time FROM appointments JOIN dentists ON appointments.dentistId = dentists.rowid JOIN clients ON appointments.clientId = clients.rowid JOIN treatments ON appointments.treatmentId = treatments.rowid', (err, appointments) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(appointments);
        });
    });
}

// Function to get all clients
export function getAllClients() {
    return new Promise((resolve, reject) => {
        db.all('SELECT rowid AS id, * FROM clients', (err, clients) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(clients);
        });
    });
}

// Function to create a new client
export function createClient(client) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO clients VALUES (?,?)');
        stmt.run(
            client.name,
            client.email,
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
        stmt.finalize();
    });
}

// ... (existing code)

