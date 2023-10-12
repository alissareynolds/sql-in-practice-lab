require('dotenv').config();

const Sequelize = require('sequelize'); 
const sequelize = new Sequelize(process.env.CONNECTION_STRING)

let nextEmp = 5



module.exports = {
    getUpcomingAppointments: (req, res) => {
        sequelize.query(`select a.appt_id, a.notes, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    approveAppointment: (req, res) => {
        let {apptId} = req.body
       
        sequelize.query(`
        
        UPDATE cc_appointments SET 
        approved = 'true'
        WHERE appt_id = ${apptId};

        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    }, 
    getAllClients: (req, res) => {
        sequelize.query(`
            SELECT * FROM cc_clients AS c
            JOIN cc_users AS u 
            ON u.user_id = c.user_id;
        `).then((dbRes) => {
            res.status(200).send(dbRes[0]);
        }).catch()
    },
    getPendingAppointments: (req, res) => {
        sequelize.query(`
        SELECT * FROM cc_appointments
        WHERE approved = 'false'
        ORDER BY cc_appointments DESC;
        `).then((dbRes) => res.status(200).send(dbRes[0]))
    }, 
    getPastAppointments: (req, res) => { 
        sequelize.query(`
        select a.appt_id, a.date, a.service_type, a.notes, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        WHERE approved = 'true' AND completed = 'true'
        ORDER BY date DESC;
        `).then((dbRes => res.status(200).send(dbRes[0])))
    },
    completeAppointment: (req, res) => {
        sequelize.query(`
        UPDATE cc_appointments SET 
        completed = 'true'
        WHERE appt_id = ${apptId};

        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `).then((dbRes) => res.status(200).send(dbRes[0]))
    }
}

