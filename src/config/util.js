import mongoose from "mongoose";
import { app_config } from "./app.config.js";
import sgMail from '@sendgrid/mail';

// Function to convert strings in cammel case
export const convert_string_cammel_case = (string) => {
    var new_array = [];
    const array = string.split('_');
    for(let i = 0; i < array.length; i++) {
        new_array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1).toLowerCase();
    }
    const result = new_array.join('');
    return result;
}

// Function to validate date format is yyyy-MM-dd HH:MM, guided by ChatGPT.
export const is_valid_date_time_format = (string) => {
    // Regular expression to match the format yyyy-MM-dd HH:MM
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
  
    if (!regex.test(string)) {
      return false;
    }
  
    // Split the date and time
    const [datePart, timePart] = string.split(" ");
  
    // Further validate using JavaScript Date object
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
  
    // Check for logical correctness
    const is_valid_date = (year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= 31) && !isNaN(new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00`).getTime());
    const is_valid_time = hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    return is_valid_date && is_valid_time;
};

// Function to validate if date is valid birthdate
export const is_valid_birthdate_format = (string, is_author = false) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if(!regex.test(string)) {
    return false;
  }
  const [year, month, day] = string.split("-").map(Number);
  const date = new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00`);
  if (isNaN(date.getTime()) || date.getUTCDate() !== day || date.getUTCMonth() + 1 !== month || date.getUTCFullYear() !== year) {
    return false;
  }
  if(date > new Date()) {
    return false;
  }
  const now = new Date();
  const age = now.getFullYear() - date.getFullYear() - (now.getMonth() < date.getMonth() || (now.getMonth() === date.getMonth() && now.getDate() < date.getDate()) ? 1 : 0);
  if (age < app_config.USER_MIN_AGE_REQUIRED || (age > app_config.USER_MAX_AGE_ALLOWED && !is_author)) {
      return false;
  }

  return true;
}

// Function to validate if date is within working hours
export const is_within_working_hours = (start, finish) => {
  const day = start.getDay();
  let working_hours;
  if((day >= 1) && (day <= 5)) {
    working_hours = app_config.WORKING_HOURS.MONDAY_TO_FRIDAY
  } else if (day === 6) {
    working_hours = app_config.WORKING_HOURS.SATURDAY
  } else {
    return false;
  }
  const [startHour, startMinute] = working_hours.start.split(":").map(Number);
  const [endHour, endMinute] = working_hours.end.split(":").map(Number);
  const dayStart = new Date(start);
  dayStart.setHours(startHour, startMinute, 0, 0);

  const dayEnd = new Date(start);
  dayEnd.setHours(endHour, endMinute, 0, 0);

  return (start >= dayStart) && (finish <= dayEnd);
}

// Funtion to generate filter from queries
export const generate_filter = (field_types, filter_field, filter_value) => {
  if(filter_field == "any") {
    const or_filters = []; 
    for (const [field, type] of Object.entries(field_types)) {
      if (type === 'ObjectId') {
        if (mongoose.isValidObjectId(filter_value)) {
          or_filters.push({ [field]: filter_value });
        }
      } else if(type == 'String') {
        or_filters.push({ [field]: { $regex: filter_value, $options: 'i' } });
      } else if(type == 'Number') {
        or_filters.push({[field]: Number(filter_value)});
      } else if(type == 'Date') {
        or_filters.push({[field]: new Date(filter_value)});
      } else {
        or_filters.push({[field]: filter_value});
      }
    }
    return { $or: or_filters };
  }

  if(field_types[filter_field] && mongoose.isValidObjectId(filter_value)) {
    return {[filter_field]: filter_value };
  } else if(field_types[filter_field] === 'String') {
    return {[filter_field]: new RegExp(filter_value, 'i')};
  } else if(field_types[filter_field] === 'Number') {
    return {[filter_field]: Number(filter_value)};
  } else if(field_types[filter_field] === 'Date') {
    return {[filter_field]: new Date(filter_value)};
  }
  return {[filter_field]: filter_value};
}

/* // Set up Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: app_config.admin_gmail_email,
    pass: app_config.admin_gmail_password
  }
}); */

/* transporter.verify((error, success) => {
  if(error) {
    console.error('Error setting up email transporter:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
}); */

/* // Function to send emails
export const send_email = async (to, subject, html) => {
  const mail_options = {
    from: app_config.admin_gmail_email,
    to: to,
    subject: subject,
    html: html
  };
  try {
    const info = await transporter.sendMail(mail_options);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
} */

sgMail.setApiKey(app_config.sendgrid_api_key);
export const send_email = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: 'aura24vindex@gmail.com', // Tu remitente verificado
      subject,
      html,
      };
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    if (error.response) {
        console.error('SendGrid Response:', error.response.body);
    }
    throw new Error('Failed to send email');
  } 
};

// Alternative function to send push notifications using Firebase Cloud Messaging (FCM)
/* export const send_push_notification = async (token, title, message) => {
    try {
        await axios.post(
            'https://fcm.googleapis.com/fcm/send',
            {
                to: token,
                notification: {
                    title,
                    body: message
                }
            },
            {
                headers: {
                    Authorization: `key=${app_config.fmc_server_key}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`Push notification sent to ${token}`);
    } catch (error) {
        console.error('FCM error:', error.message);
    }
}; */