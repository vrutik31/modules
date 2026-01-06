import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function Bed() {
  const API = "https://adminapi.hayatplus.online/bed/";

  const [beds, setBeds] = useState([]);
  const [editId, setEditId] = useState(null);
  const [viewBed, setViewBed] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      bed_number: "",
      status: "vacant",
    },
  });

  // Status badge helper
  const statusBadge = (status) =>
    status === "occupied" ? "bg-danger" : "bg-success";

  // Fetch Beds
  const fetchBeds = async () => {
    try {
      const res = await axios.get(API);
      setBeds(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  // ADD / UPDATE
  const onSubmit = async (data) => {
    try {
      if (editId === null) {
        await axios.post(API, data);
      } else {
        await axios.patch(`${API}${editId}/`, data);
      }

      reset();
      setEditId(null);
      setShowForm(false);
      fetchBeds();
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  // EDIT MODE
  const handleEdit = (bed) => {
    setEditId(bed.id);
    setViewBed(null);
    setShowForm(true);

    reset({
      name: bed.name,
      bed_number: bed.bed_number,
      status: bed.status,
    });
  };

  // VIEW MODE
  const handleView = (bed) => {
    setViewBed(bed);
    setShowForm(false);
    setEditId(null);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bed?")) return;

    try {
      await axios.delete(`${API}${id}/`);
      fetchBeds();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-3">Bed Management</h2>

      {/* ============ VIEW MODE ============ */}
      {viewBed ? (
        <div className="card p-3 shadow">
          <h4>Bed Details</h4>

          <p><b>Ward:</b> {viewBed.name}</p>
          <p><b>Bed No:</b> {viewBed.bed_number}</p>

          <p>
            <b>Status:</b>
            <span className={`badge ${statusBadge(viewBed.status)} ms-2`}>
              {viewBed.status}
            </span>
          </p>

          <button className="btn btn-secondary" onClick={() => setViewBed(null)}>
            ⬅ Back to List
          </button>
        </div>
      )

      /* ============ FORM MODE ============ */
      : showForm ? (
        <div className="card p-3 shadow">

          <h4>{editId ? "Update Bed" : "Add New Bed"}</h4>

          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="row mt-2">

              <div className="col-md-4">
                <label>Ward / Unit</label>
                <input
                  className="form-control"
                  {...register("name", { required: "Ward name is required" })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              <div className="col-md-4">
                <label>Bed Number</label>
                <input
                  className="form-control"
                  {...register("bed_number", {
                    required: "Bed number is required",
                  })}
                />
                {errors.bed_number && (
                  <small className="text-danger">{errors.bed_number.message}</small>
                )}
              </div>

              <div className="col-md-4">
                <label>Status</label>
                <select className="form-control" {...register("status")}>
                  <option value="vacant">Vacant</option>
                  <option value="occupied">Occupied</option>
                </select>
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
                ⬅ Back to List
              </button>

              <button type="submit" className="btn btn-primary">
                {editId ? "Save Changes" : "Add Bed"}
              </button>
            </div>
          </form>
        </div>
      )

      /* ============ LIST MODE ============ */
      : (
        <>
          <button className="btn btn-primary mb-3" onClick={() => {
            reset();
            setEditId(null);
            setShowForm(true);
          }}>
            ➕ Add Bed
          </button>

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Ward</th>
                <th>Bed No</th>
                <th>Status</th>
                <th width="200">Actions</th>
              </tr>
            </thead>

            <tbody>
              {beds.map((bed) => (
                <tr key={bed.id}>
                  <td>{bed.name}</td>
                  <td>{bed.bed_number}</td>

                  <td>
                    <span className={`badge ${statusBadge(bed.status)}`}>
                      {bed.status}
                    </span>
                  </td>

                  <td>
                    <button className="btn btn-sm btn-info me-2" onClick={() => handleView(bed)}>
                      View
                    </button>

                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(bed)}>
                      Edit
                    </button>

                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(bed.id)}>
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










// // src/Pages/Bed.jsx
// import { useEffect, useState } from "react";
// import { getBeds, createBed, updateBed, deleteBed } from "../services/bed.services";
// import { Eye, Pencil, Trash2, Plus } from "lucide-react";
// import "../styles/bed.css";

// export default function Bed() {
//   const [beds, setBeds] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingBed, setEditingBed] = useState(null);
//   const [viewingBed, setViewingBed] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     bed_number: "",
//     status: "vacant",
//   });

//   useEffect(() => {
//     fetchBeds();
//   }, []);

//   const fetchBeds = async () => {
//     setLoading(true);
//     try {
//       const data = await getBeds();

//       let normalized = data;
//       if (!Array.isArray(normalized) && normalized) {
//         normalized = normalized.results || normalized.data || [];
//       }

//       setBeds(Array.isArray(normalized) ? normalized : []);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.detail || err.message || "Failed to fetch beds");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openAddModal = () => {
//     setEditingBed(null);
//     setViewingBed(null);
//     setFormData({
//       name: "",
//       bed_number: "",
//       status: "vacant",
//     });
//     setIsModalOpen(true);
//   };

//   const openEditModal = (bed) => {
//     setEditingBed(bed);
//     setViewingBed(null);
//     setFormData({
//       name: bed.name || "",
//       bed_number: String(bed.bed_number ?? ""),
//       status: bed.status || "vacant",
//     });
//     setIsModalOpen(true);
//   };

//   const openView = (bed) => {
//     setViewingBed(bed);
//     setIsModalOpen(false);
//     setEditingBed(null);
//     setError("");
//   };

//   const closeView = () => {
//     setViewingBed(null);
//     setError("");
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingBed(null);
//     setError("");
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       if (editingBed) {
//         await updateBed(editingBed.id, formData);
//       } else {
//         await createBed(formData);
//       }

//       closeModal();
//       fetchBeds();
//     } catch (err) {
//       const msg =
//         err.response?.data?.detail ||
//         Object.values(err.response?.data || {})[0] ||
//         err.message ||
//         "Failed to save bed";
//       setError(Array.isArray(msg) ? msg.join(", ") : msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this bed?")) return;

//     setLoading(true);
//     try {
//       await deleteBed(id);
//       fetchBeds();
//     } catch (err) {
//       setError(err.response?.data?.detail || err.message || "Failed to delete");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusBadge = (status) => {
//     const normalized = String(status || "").toLowerCase();
//     if (normalized === "occupied") {
//       return "bg-red-100 text-red-700 border-red-200";
//     }
//     return "bg-green-100 text-green-700 border-green-200";
//   };

//   return (
//     <div className="hp-page">
//       <div className="hp-page-bg">
//         <div className="hp-blob hp-animate-float -top-24 -left-28 h-80 w-80 bg-gradient-to-br from-indigo-400/70 via-fuchsia-400/60 to-sky-400/60" />
//         <div
//           className="hp-blob hp-animate-float top-10 -right-24 h-72 w-72 bg-gradient-to-br from-emerald-400/60 via-cyan-400/60 to-indigo-400/50"
//           style={{ animationDelay: "-1.6s" }}
//         />
//       </div>

//       <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="min-w-0">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
//               Bed Management
//             </h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Manage ward/unit beds and availability.
//             </p>
//           </div>

//           <button
//             onClick={openAddModal}
//   className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-3"
//           >
//             <Plus size={18} className="shrink-0" />
//             <span className="font-semibold">Add New Bed</span>
//           </button>
//         </div>

//         {/* Global error (not in view mode) */}
//         {error && !viewingBed && (
//           <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
//             {error}
//           </div>
//         )}

//         {/* FORM PANEL */}
//         {isModalOpen ? (
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6 hp-animate-pop">
//             <div className="mb-5 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
//                 {editingBed ? "Edit Bed" : "Add New Bed"}
//               </h2>
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="hp-action-btn hp-action-neutral hp-glow-btn w-full sm:w-auto px-3 py-2"
//               >
//                 Back to List
//               </button>
//             </div>

//             {error && (
//               <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
//                 <div className="min-w-0">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Ward/Unit Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="e.g. ICU"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full border rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 <div className="min-w-0">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Bed Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="bed_number"
//                     placeholder="e.g. 12"
//                     value={formData.bed_number}
//                     onChange={handleInputChange}
//                     required
//                     inputMode="numeric"
//                     className="w-full border rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 <div className="min-w-0 md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="w-full border rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="vacant">vacant</option>
//                     <option value="occupied">occupied</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
//                 >
//                   {loading ? "Saving..." : editingBed ? "Update Bed" : "Add Bed"}
//                 </button>
//               </div>
//             </form>
//           </div>

//         /* VIEW PANEL */
//         ) : viewingBed ? (
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6 hp-animate-pop">
//             <div className="mb-5 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Bed Details</h2>
//               <button
//                 type="button"
//                 onClick={closeView}
//                 className="hp-action-btn hp-action-neutral hp-glow-btn w-full sm:w-auto px-3 py-2"
//               >
//                 Back to List
//               </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//               <div className="rounded-xl border border-gray-100 bg-white p-4">
//                 <div className="text-xs text-gray-500">Ward/Unit</div>
//                 <div className="mt-1 text-sm sm:text-base font-semibold text-gray-900 break-words">
//                   {viewingBed.name || "-"}
//                 </div>
//               </div>

//               <div className="rounded-xl border border-gray-100 bg-white p-4">
//                 <div className="text-xs text-gray-500">Bed Number</div>
//                 <div className="mt-1 text-sm sm:text-base font-semibold text-gray-900 break-words">
//                   {viewingBed.bed_number ?? "-"}
//                 </div>
//               </div>

//               <div className="rounded-xl border border-gray-100 bg-white p-4 sm:col-span-2">
//                 <div className="text-xs text-gray-500">Status</div>
//                 <div className="mt-2">
//                   <span
//                     className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${statusBadge(
//                       viewingBed.status
//                     )}`}
//                   >
//                     {(viewingBed.status || "vacant").toString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//         /* LIST VIEW */
//         ) : loading && beds.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">Loading beds…</div>
//         ) : (
//           <div className="hp-animate-pop space-y-4" style={{ animationDelay: "120ms" }}>
//             {/* Desktop/Tablet table (md and up) */}
//             <div className="hidden md:block hp-table-wrap">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-white/40 backdrop-blur">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
//                         Ward/Unit
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
//                         Bed Number
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {beds.length === 0 ? (
//                       <tr>
//                         <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
//                           No beds found.
//                         </td>
//                       </tr>
//                     ) : (
//                       beds.map((bed) => (
//                         <tr key={bed.id} className="hover:bg-slate-50/80 transition-colors">
//                           <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
//                             {bed.name || "-"}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
//                             {bed.bed_number ?? "-"}
//                           </td>
//                           <td className="px-6 py-4 text-sm whitespace-nowrap">
//                             <span
//                               className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${statusBadge(
//                                 bed.status
//                               )}`}
//                             >
//                               {(bed.status || "vacant").toString()}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="flex justify-end items-center gap-2 whitespace-nowrap">
//                               <button
//                                 onClick={() => openView(bed)}
//                                 className="hp-action-btn hp-action-neutral hp-glow-btn px-3 py-2"
//                                 title="View"
//                               >
//                                 <Eye size={14} className="shrink-0" />
//                                 <span className="hidden lg:inline">View</span>
//                               </button>
//                               <button
//                                 onClick={() => openEditModal(bed)}
//                                 className="hp-action-btn hp-action-edit hp-glow-btn px-3 py-2"
//                                 title="Edit"
//                               >
//                                 <Pencil size={14} className="shrink-0" />
//                                 <span className="hidden lg:inline">Edit</span>
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(bed.id)}
//                                 className="hp-action-btn hp-action-danger hp-glow-btn px-3 py-2"
//                                 title="Delete"
//                               >
//                                 <Trash2 size={14} className="shrink-0" />
//                                 <span className="hidden lg:inline">Delete</span>
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Mobile cards (below md) */}
//             <div className="md:hidden">
//               {beds.length === 0 ? (
//                 <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-gray-500">
//                   No beds found.
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 gap-3">
//                   {beds.map((bed) => (
//                     <div
//                       key={bed.id}
//                       className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
//                     >
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="min-w-0">
//                           <div className="text-xs text-gray-500">Ward/Unit</div>
//                           <div className="mt-1 text-base font-semibold text-gray-900 break-words">
//                             {bed.name || "-"}
//                           </div>

//                           <div className="mt-3 grid grid-cols-2 gap-3">
//                             <div className="min-w-0">
//                               <div className="text-xs text-gray-500">Bed #</div>
//                               <div className="mt-1 text-sm font-medium text-gray-800 break-words">
//                                 {bed.bed_number ?? "-"}
//                               </div>
//                             </div>
//                             <div className="min-w-0">
//                               <div className="text-xs text-gray-500">Status</div>
//                               <div className="mt-2">
//                                 <span
//                                   className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${statusBadge(
//                                     bed.status
//                                   )}`}
//                                 >
//                                   {(bed.status || "vacant").toString()}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Quick actions */}
//                         <div className="flex flex-col gap-2 shrink-0">
//                           <button
//                             onClick={() => openView(bed)}
//                             className="hp-action-btn hp-action-neutral hp-glow-btn px-3 py-2"
//                             title="View"
//                           >
//                             <Eye size={16} className="shrink-0" />
//                             <span>View</span>
//                           </button>
//                           <button
//                             onClick={() => openEditModal(bed)}
//                             className="hp-action-btn hp-action-edit hp-glow-btn px-3 py-2"
//                             title="Edit"
//                           >
//                             <Pencil size={16} className="shrink-0" />
//                             <span>Edit</span>
//                           </button>
//                           <button
//                             onClick={() => handleDelete(bed.id)}
//                             className="hp-action-btn hp-action-danger hp-glow-btn px-3 py-2"
//                             title="Delete"
//                           >
//                             <Trash2 size={16} className="shrink-0" />
//                             <span>Delete</span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }