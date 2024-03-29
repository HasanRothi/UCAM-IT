const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("../database/model/testStudent");
const nodemailer = require("nodemailer");

//Send mail to students

const basePath = "http://localhost:3000/";
// const x = require("../");
const facultyPath = "student";
//course list
router.get("/", (req, res, next) => {
  // global.noticeTitleForStudent = "Variable from api";
  // const sendMail = require("../../mailSender/notifyStudentByNotice");

  Student.find()
    .select()
    .populate("courseList.courseInfo")
    .exec()
    .then((allStudent) => {
      const response = {
        "Number of student": allStudent.length,
        Students: allStudent.map((student) => {
          return {
            id: student.userId,
            Name: student.name,
            Phone: student.phone,
            Mail: student.mail,
            TotalCourse: student.courseList.length,
            CourseList: student.courseList,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Single student
router.get("/:studentId", (req, res, next) => {
  const id = req.params.studentId;
  console.log(id);
  if (id.length < 15) quryMethod = Student.find({ userId: id });
  else quryMethod = Student.find({ _id: id });
  quryMethod
    .select()
    .populate("courseList.courseInfo")
    .exec()
    .then((info) => {
      res.status(200).json(info);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Result: "student not found", error: err });
    });
});

//add new student
router.post("/", (req, res, next) => {
  //student data object
  const student = new Student({
    _id: new mongoose.Types.ObjectId(),
    userId: req.body.userId,
    name: req.body.name,
    password: req.body.password,
    phone: req.body.phone,
    mail: req.body.mail,
  });

  //insert query
  student
    .save()
    .then((result) => {
      console.log("Success\n" + result);
      res.status(200).json({
        message: "Student Inserted Successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//add course
router.post("/addcourse", (req, res, next) => {
  const studentid = req.body.studentId;
  const studentCourse = req.body.courseList;
  var queryAddCourse = new Array("");
  var l = -1;
  studentCourse.forEach((element) => {
    l++;
    queryAddCourse[l] = { courseInfo: studentCourse[l] };
  });

  Student.updateOne(
    { userId: studentid },
    {
      $addToSet: {
        courseList: {
          $each: [
            queryAddCourse[0],
            queryAddCourse[1],
            queryAddCourse[2],
            queryAddCourse[3],
            queryAddCourse[4],
            queryAddCourse[5],
            queryAddCourse[6],
            queryAddCourse[7],
            queryAddCourse[8],
            queryAddCourse[9],
          ],
        },
      },
    }
  )
    .exec()
    .then((msg) => {
      res.json(msg);
      //remove null course
      Student.updateOne(
        { userId: studentid },
        { $pullAll: { courseList: [null] } }
      )
        .exec()
        .then((nMsg) => {
          console.log(nMsg);
        })
        .catch((nErr) => {
          console.log("Error in remove null course" + nMsg);
        });
    })
    .catch((errMsg) => {
      res.json("Error in add course" + errMsg);
    });
});

//Delete course
router.delete("/removecourse/:studentId", (req, res, next) => {
  console.log(req.params.studentId);
  const studentid = req.params.studentid;
  const course = req.body.course;
  console.log(course);
  Student.updateOne(
    { userId: studentid },
    { $pullAll: { courseList: [{ _id: course }] } }
  )
    .exec()
    .then((nMsg) => {
      res.json(nMsg);
    })
    .catch((nErr) => {
      res.json(nErr);
    });
});
//Delete student
router.delete("/:studentid", (req, res, next) => {
  const studentid = req.params.studentid;
  // console.log(studentid);
  Student.deleteOne({ userId: studentid })
    .exec()
    .then((msg) => {
      res.json("Student removed");
    })
    .catch((msgErr) => {
      res.json(msgErr);
    });
});
module.exports = router;
