import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
} from "../services/course.service";
import { buildImageUrl } from "../services/image.helper";

export default function Courses() {

    const [list, setList] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [viewData, setViewData] = useState(null);


    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            category: "",
            name: "",
            text: "",
            image: null,
            banner_img: null,
            pdf_file: null
        }
    });

    //fetch data
    const fetchData = async () => {
        const data = await getCourses();
        setList(data);
    };

    useEffect(() => { fetchData(); }, []);

    //
    const onSubmit = async (values) => {
        try {
            const formData = new FormData();

            formData.append("category", values.category);
            formData.append("name", values.name);
            formData.append("text", values.text);

            if (values.image?.[0]) formData.append("image", values.image[0]);
            if (values.banner_img?.[0]) formData.append("banner_img", values.banner_img[0]);
            if (values.pdf_file?.[0]) formData.append("pdf_file", values.pdf_file[0]);

            if (editId) {
                await updateCourse(editId, formData);
            } else {
                await createCourse(formData);
            }

            reset();
            setEditId(null);
            setShowForm(false);
            fetchData();

        } catch (err) {
            console.log("API ERROR 👉", err.response?.data);
        }
    };

    const handleEdit = (row) => {
        setEditId(row.id);
        setShowForm(true);

        reset({
            category: row.category,
            name: row.name,
            text: row.text,
            image: null,
            banner_img: null,
            pdf_file: null
        });
    };
    const handleView = (row) => {
        setViewData(row);
        setShowForm(true);
        setEditId(null);   // not editing mode

        reset({
            category: row.category,
            name: row.name,
            text: row.text
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete course?")) return;
        await deleteCourse(id);
        fetchData();
    };


    return (
        <div className="container mt-4">

            {showForm ? (
                <div className="card p-3 shadow">

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="row mt-2">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={() => {
                                    reset();
                                    setShowForm(false);
                                    setEditId(null);
                                    setViewData(null);
                                }}
                            >
                                Back to List
                            </button>

                            <div className="col-md-6">
                                <label>Category ID</label>
                                <input
                                    className="form-control"
                                    {...register("category", { required: true })}
                                    disabled={viewData !== null}
                                />
                            </div>

                            <div className="col-md-6">
                                <label>Course Name</label>
                                <input
                                    className="form-control"
                                    {...register("name", { required: true })}
                                    disabled={viewData !== null}
                                />
                            </div>

                            <div className="col-md-12 mt-2">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    {...register("text")}
                                    disabled={viewData !== null}
                                />
                            </div>
                            {viewData && viewData.image && (
                                <div className="mt-2">
                                    <label>Current Image</label> <br />
                                    <img
                                        src={buildImageUrl(viewData.image)}
                                        width={150}
                                        style={{ borderRadius: 8 }}
                                        alt="course"
                                    />
                                </div>
                            )}

                            <div className="col-md-4 mt-2">
                                <label>Image</label>
                                <input type="file" className="form-control" {...register("image")} />
                            </div>

                            <div className="col-md-4 mt-2">
                                <label>Banner Image</label>
                                <input type="file" className="form-control" {...register("banner_img")} />
                            </div>

                            <div className="col-md-4 mt-2">
                                <label>PDF File</label>
                                <input type="file" className="form-control" {...register("pdf_file")} />
                            </div>

                        </div>


                        {/* buttons here */}
                        {viewData ? null : (
                            <div className="mt-3">

                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={() => {
                                        reset();
                                        setShowForm(false);
                                        setEditId(null);
                                        setViewData(null);
                                    }}
                                >
                                    Back to List
                                </button>

                                <button type="submit" className="btn btn-primary">
                                    {editId ? "Save Changes" : "Add Course"}
                                </button>

                            </div>
                        )}



                    </form>
                </div>
            ) : (
                <>
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => { reset(); setEditId(null); setShowForm(true); }}
                    >
                        Add Course
                    </button>

                    {/* 🔹 STEP-4 — Table */}
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: "90px" }}>Image</th>
                                <th style={{ width: "90px" }}>Name</th>
                                <th style={{ width: "90px" }}>Category</th>
                                <th style={{ width: "90px" }}>Text</th>
                                <th style={{ width: "120px" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {list.map(c => (
                                <tr key={c.id}>

                                    <td>
                                        <img src={buildImageUrl(c.image)} width={70} />
                                        <img src={buildImageUrl(c.banner_img)} width={70} />

                                        <img src={buildImageUrl(c.pdf_file)} width={70} />

                                    </td>

                                    <td>{c.name}</td>
                                    <td>{c.category_details?.name}</td>
                                    <td>{c.text?.slice(0, 40)}...</td>

                                    <td>
                                        <button
                                            className="btn btn-info btn-sm me-2"
                                            onClick={() => handleView(c)}
                                        >
                                            👁 View
                                        </button>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(c)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(c.id)}
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