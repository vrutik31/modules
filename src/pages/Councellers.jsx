// - states
// - load data
// - form logic
// - submit (add/edit)
// - view
// - delete

import { useState, useEffect } from "react";
import { getCounsellors, createCounsellor, updateCounsellor, deleteCounsellor } from "../services/counceller.service";
import { useForm } from "react-hook-form";


export default function Councellers() {
    //state
    const [list, setList] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            full_name: "",
            mobile: "",
            email: "",
            password: "",
            role: "",
            language_known: "",
            school: ""
        }
    });

    //load data
    const fetchData = async () => {
        const data = await getCounsellors();
        setList(data)
    }
    useEffect(() => { fetchData(); }, []);

    // submit
    const onSubmit = async (values) => {
        try {
            const payload = { ...values, school: 69 };

            if (editId) {
                // 🔥 do not send password unless user changed it
                if (!values.password || values.password.trim() === "") {
                    delete payload.password;
                }

                await updateCounsellor(editId, payload);
            }
            else {
                await createCounsellor(payload);
            }

            reset();
            setEditId(null);
            setShowForm(false);
            fetchData();

        } catch (err) {
            console.log("API ERROR (FULL) 👉", err);
            console.log("RESPONSE 👉", err?.response?.data);
        }
    };


    // edit
    const handleEdit = (row) => {
        setEditId(row.id);
        setShowForm(true);
        reset({
            ...row,
            password: ""   // 🔥 do not send hashed password
        });

    };
    // delete
    const handleDelete = async (id) => {
        if (!window.confirm("Delete user?")) return;
        await deleteCounsellor(id);
        fetchData();
    };

    return (
        <div className="container mt-4">

            <h2>Counsellor Management</h2>

            {showForm ? (
                // ------------ FORM VIEW ------------
                <div className="card p-3 shadow">

                    <h4>{editId ? "Update Counsellor" : "Add Counsellor"}</h4>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="row mt-2">

                            <div className="col-md-6">
                                <label>Full Name</label>
                                <input
                                    className="form-control"
                                    {...register("full_name", { required: true })}
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="col-md-6">
                                <label>Mobile</label>
                                <input
                                    className="form-control"
                                    {...register("mobile", { required: true })}
                                    placeholder="Enter mobile"
                                />
                            </div>

                            <div className="col-md-6">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    {...register("email", { required: true })}
                                    placeholder="Enter email"
                                />
                            </div>

                            <div className="col-md-6">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    {...register("password")}
                                    placeholder="Enter password"
                                    autoComplete="new-password"
                                />

                                <small className="text-muted">
                                    (Leave blank while editing if you don't want to change)
                                </small>
                            </div>

                            <div className="col-md-6">
                                <label>Role</label>
                                <select className="form-control" {...register("role")}>
                                    <option value="counsellor">Counsellor</option>
                                    <option value="front-desk">Front-desk</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label>Language Known</label>
                                <input
                                    className="form-control"
                                    {...register("language_known")}
                                    placeholder="e.g. English, Hindi"
                                />
                            </div>

                            <div className="col-md-6">
                                {/* <label>School</label> */}
                                <input type="hidden" {...register("school")} value={69} />

                            </div>

                        </div>


                        <div className="mt-3">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={() => {
                                    reset();
                                    setShowForm(false);
                                    setEditId(null);
                                }}
                            >
                                Back to List
                            </button>

                            <button type="submit" className="btn btn-primary">
                                {editId ? "Save Changes" : "Add Counsellor"}
                            </button>
                        </div>

                    </form>
                </div>

            ) : (
                // ------------ TABLE VIEW ------------
                <>
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => {
                            reset();
                            setEditId(null);
                            setShowForm(true);
                        }}
                    >
                        Add Counsellor
                    </button>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Language</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {list.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.full_name}</td>
                                    <td>{u.mobile}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{u.language_known}</td>

                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(u)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(u.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </>
            )}

        </div>
    );

}