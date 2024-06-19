import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

function App() {
    const [initial_values, setInitial_values] = useState({
        username: "",
        dob: "",
        age: "",
    });
    const [allUsers, setAllUsers] = useState(
        JSON.parse(localStorage.getItem("kc_users")) || []
    );
    const [editIndex, setEditIndex] = useState(-1);

    const [editFlag, setEditFlag] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);

    let indexToBeEdited = -1;

    const validation_schema = Yup.object().shape({
        username: Yup.string().required("Name is required."),
        dob: Yup.date()
            .required("Date of Birth is required")
            .max(new Date(), "Date of Birth cannot be in the future") // Optionally limit to past dates
            .test("is-old-enough", "Must be 18 or older", function (value) {
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();
                return age >= 18;
            }),
    });

    const handleSubmit = (values, { resetForm }) => {
        console.log("clikced");
        console.log(values);

        if (!editFlag) {
            setAllUsers([...allUsers, values]);
            localStorage.setItem(
                "kc_users",
                JSON.stringify([...allUsers, values])
            );
        }

        if (editFlag) {
            allUsers.splice(editIndex, 1, values);
            localStorage.setItem("kc_users", JSON.stringify(allUsers));
            setEditFlag(false);
            setInitial_values({ username: "", dob: "", age: "" });
        }

        resetForm();
    };

    const handleEdit = (id) => {
        console.log("edit option");
        setEditFlag(true);
        let userToBeEdited = allUsers.find((_, index) => {
            indexToBeEdited++;
            return index === id;
        });

        setEditIndex(indexToBeEdited);

        setInitial_values(userToBeEdited);
    };

    const handleDelete = (id) => {
        const newUsers = allUsers.filter((_, index) => id !== index);
        setAllUsers(newUsers);
        localStorage.setItem("kc_users", JSON.stringify(newUsers));
    };

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age.toString(); // Return age as string
    };

    return (
        <>
            <div className="wrapper">
                <div className="user_container">
                    <p>{editFlag ? "Edit User" : "Add User"}</p>
                    <Formik
                        initialValues={initial_values}
                        validationSchema={validation_schema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({
                            values,
                            setFieldValue,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            isValid,
                            dirty,
                        }) => (
                            <Form>
                                {" "}
                                <div className="form_group">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Enter a name"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.username && touched.username && (
                                        <span>{errors.username}</span>
                                    )}
                                </div>
                                <div className="form_group">
                                    <input
                                        type="date"
                                        name="dob"
                                        placeholder="Enter your DOB"
                                        value={values.dob}
                                        max={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(e) => {
                                            handleChange(e);
                                            const age = calculateAge(
                                                e.target.value
                                            );
                                            setFieldValue("age", age);
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    {errors.dob && touched.dob && (
                                        <span>{errors.dob}</span>
                                    )}
                                </div>
                                <div className="form_group">
                                    <input
                                        className="age"
                                        type="number"
                                        name="age"
                                        value={values.age}
                                        readOnly
                                    />
                                    {/* {errors.age && touched.age && (
                                        <span>{errors.age}</span>
                                    )} */}
                                </div>
                                <button
                                    type="submit"
                                    disabled={!(dirty && isValid) && !editFlag}
                                >
                                    {editFlag ? "edit user" : "add user"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="user_list_container">
                    <p>List of Users</p>
                    {allUsers.length <= 0 ? (
                        <p>No users yet.</p>
                    ) : (
                        <div className="soso_container">
                            <div className="table_head first">
                                <span>S/N</span>
                                <span>Name</span>
                                <span className="sn">Age</span>
                                <span>DOB</span>
                            </div>
                            {allUsers.map((item, index) => {
                                return (
                                    <div
                                        className="table_head a_item"
                                        key={index}
                                    >
                                        <span className="sn">{index + 1}</span>
                                        <span>{item.username}</span>
                                        <span className="sn">{item.age}</span>
                                        <span className="goo">
                                            {item.dob}

                                            <span className="tools">
                                                <span
                                                    onClick={() =>
                                                        handleEdit(index)
                                                    }
                                                >
                                                    <i className="fa-solid fa-pen edit"></i>
                                                </span>
                                                <span
                                                    onClick={() =>
                                                        handleDelete(index)
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash delete"></i>
                                                </span>
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
