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

    // let initial_values = {
    //     username: "",
    //     dob: "",
    //     age: "",
    // };

    const validation_schema = Yup.object().shape({
        username: Yup.string().required("Name is required."),
        dob: Yup.string().required("DOB is required"),
        age: Yup.number()
            .required("Number is required")
            .min(18, "Must be at least 18 years old."),
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
            console.log(editIndex);
            allUsers.splice(editIndex, 1, values);
            localStorage.setItem("kc_users", JSON.stringify(allUsers));
            setEditFlag(false);
            setInitial_values({ username: "", dob: "", age: "" });
        }

        // setUser({ username: "", dob: "", age: "" });
        resetForm();
    };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setUser((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };

    const handleEdit = (id) => {
        console.log("edit option");
        // change the edit flag to true
        setEditFlag(true);
        // obtain the object
        let userToBeEdited = allUsers.find((_, index) => {
            indexToBeEdited++;
            return index === id;
        });

        // console.log(indexToBeEdited);
        setEditIndex(indexToBeEdited);

        setInitial_values(userToBeEdited);
    };

    const handleDelete = (id) => {
        const newUsers = allUsers.filter((_, index) => id !== index);
        setAllUsers(newUsers);
        localStorage.setItem("kc_users", JSON.stringify(newUsers));
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
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.dob && touched.dob && (
                                        <span>{errors.dob}</span>
                                    )}
                                </div>
                                <div className="form_group">
                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="Enter your age"
                                        value={values.age}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.age && touched.age && (
                                        <span>{errors.age}</span>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={!(dirty && isValid) && !editFlag} //if the form has been touched and there are no errors and the edit btn has not been clicked, the button is enabled. if the form has not been touched and the edit button has been clicked, the button should be enabled.
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
