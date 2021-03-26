const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const express = require("express");
const PORT = 99;
const pk = "developmentk";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, (req, res) => {
  console.log("up & running");
});

app.post("/sendmail", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "user@email.com",
      serviceClient: "1234",
      privateKey: pk,
    },
  });

  const mailOptions = {
    from: "user@email.com",
    to: req.body.email,
    subject: "Koodi salasanan nollaamiseen",
    html:
      "<p>Hei,</p><p>Koodi salasanan nollaamiseen on: " +
      req.body.resetToken +
      "</p><p>Osoite: <a href='https://makro.diet/resetpassword'>https://makro.diet/resetpassword<a></p>" +
      "<p>Ystävällisin terveisin,</p><p>Makro Support</p>",
  };

  transporter.sendMail(mailOptions, (err, result) => {
    if (err) {
      res = { success: false, error: err };
      res.status(200).send({ success: false, error: err });
    }

    res.status(200).send({ success: true, error: null });
  });
});
