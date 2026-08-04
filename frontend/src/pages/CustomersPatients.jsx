import { useState, useEffect, useCallback, useMemo } from 'react';
import API from '../api/axios';
import { Users, Plus, Edit, Trash2, Search, HeartPulse, Phone, Mail, Award, ShieldAlert } from 'lucide-react';
import {
  DataTable,
  Input,
  Select,
  Textarea,
  Badge,
  Button,
  Modal,
  Skeleton,
  useToast
} from '../components/ui';

const CustomersPatients = () => {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    age: 30,
    gender: 'unspecified',
    address: '',
    allergies: '',
    medicalNotes: '',
    loyaltyPoints: 0
  });

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/customers/customers');
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
      toast.error(err.response?.data?.message || 'Failed to load patient directory.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenCreateModal = () => {
    setEditingCustomer(null);
    setForm({
      name: '',
      phone: '',
      email: '',
      age: 30,
      gender: 'unspecified',
      address: '',
      allergies: '',
      medicalNotes: '',
      loyaltyPoints: 0
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      age: customer.age !== undefined && customer.age !== null ? customer.age : 30,
      gender: customer.gender || 'unspecified',
      address: customer.address || '',
      allergies: Array.isArray(customer.allergies)
        ? customer.allergies.join(', ')
        : customer.allergies || '',
      medicalNotes: customer.medicalNotes || '',
      loyaltyPoints: customer.loyaltyPoints || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        age: Number(form.age) || 0,
        allergies:
          typeof form.allergies === 'string'
            ? form.allergies
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : form.allergies
      };

      if (editingCustomer) {
        await API.put(`/customers/customers/${editingCustomer._id}`, payload);
        toast.success(`Patient profile "${form.name}" updated successfully!`);
      } else {
        await API.post('/customers/customers', payload);
        toast.success(`Patient profile "${form.name}" created successfully!`);
      }
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save patient profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (customer) => {
    const confirmed = await toast.confirm({
      title: 'Delete Patient Profile',
      message: `Are you sure you want to delete patient profile "${customer.name}"? This action cannot be undone.`,
      confirmText: 'Delete Profile',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (!confirmed) return;

    try {
      await API.delete(`/customers/customers/${customer._id}`);
      toast.success(`Deleted patient profile "${customer.name}"`);
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete customer profile');
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesGender =
        genderFilter === 'all' || (c.gender || 'unspecified') === genderFilter;

      return matchesSearch && matchesGender;
    });
  }, [customers, searchTerm, genderFilter]);

  const columns = [
    {
      header: 'Patient Name & Email',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">
            {row.name ? row.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <p className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              {row.name}
            </p>
            {row.email && (
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-normal">
                {row.email}
              </p>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Phone Number',
      accessor: 'phone',
      render: (row) => (
        <span className="font-mono text-purple-400 font-medium">{row.phone}</span>
      )
    },
    {
      header: 'Age / Gender',
      render: (row) => {
        const ageText =
          row.age !== undefined && row.age !== null && row.age !== ''
            ? `${row.age} yrs`
            : 'N/A';
        return (
          <span className="text-slate-300 dark:text-slate-300 light:text-slate-700">
            {ageText} / <span className="capitalize">{row.gender || 'unspecified'}</span>
          </span>
        );
      }
    },
    {
      header: 'Drug Allergies',
      render: (row) => {
        const allergyList = Array.isArray(row.allergies)
          ? row.allergies
          : typeof row.allergies === 'string' && row.allergies.trim()
          ? row.allergies.split(',').map((a) => a.trim()).filter(Boolean)
          : [];

        if (allergyList.length === 0) {
          return <Badge variant="neutral" size="sm">None Logged</Badge>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {allergyList.map((allergy, idx) => (
              <Badge key={idx} variant="danger" size="sm" icon={ShieldAlert}>
                {allergy}
              </Badge>
            ))}
          </div>
        );
      }
    },
    {
      header: 'Loyalty Points',
      accessor: 'loyaltyPoints',
      render: (row) => (
        <Badge variant="success" size="md" icon={Award}>
          {row.loyaltyPoints || 0} pts
        </Badge>
      )
    },
    {
      header: 'Created Date',
      render: (row) => (
        <span className="text-slate-400 text-xs">
          {new Date(row.createdAt || Date.now()).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(row);
            }}
            title="Edit Patient Profile"
          >
            <Edit className="w-3.5 h-3.5 mr-1 text-purple-400" /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            title="Delete Patient Profile"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Patients & Client Directory
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-0.5">
            Track patient profiles, loyalty rewards, allergy alerts, and dosage history
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Patient Profile
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white p-3.5 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div className="sm:col-span-2">
          <Input
            type="text"
            placeholder="Search by Patient Name, Phone Number, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={Search}
            size="sm"
          />
        </div>

        <div>
          <Select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            size="sm"
            options={[
              { value: 'all', label: 'All Genders' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
              { value: 'unspecified', label: 'Unspecified' }
            ]}
          />
        </div>
      </div>

      {/* Patients Data Table */}
      {loading ? (
        <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white p-6 rounded-2xl border border-slate-800">
          <Skeleton.Table rows={6} columns={6} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredCustomers}
          searchable={false}
          pagination={true}
          pageSize={10}
          emptyMessage="No matching patient profiles found. Click '+ Add Patient Profile' to create one."
        />
      )}

      {/* Add / Edit Patient Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCustomer ? 'Edit Patient Profile' : 'Create Patient Profile'}
        description="Fill in patient details, loyalty points, and known drug allergy sensitivities."
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : editingCustomer
                ? 'Update Profile'
                : 'Save Profile'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Patient Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Doe"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 555 9988"
            />

            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="patient@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Age (Years)"
              type="number"
              min="0"
              max="120"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="30"
            />

            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'unspecified', label: 'Unspecified' }
              ]}
            />

            <Input
              label="Loyalty Points"
              type="number"
              min="0"
              value={form.loyaltyPoints}
              onChange={(e) =>
                setForm({ ...form, loyaltyPoints: Number(e.target.value) })
              }
            />
          </div>

          <Input
            label="Known Drug Allergies"
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            placeholder="e.g. Penicillin, Aspirin, Sulfa drugs"
            helperText="Separate multiple allergies with commas"
          />

          <Textarea
            label="Medical Notes & Special Instructions"
            rows={3}
            value={form.medicalNotes}
            onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
            placeholder="Patient dosage sensitivities, chronic conditions..."
          />
        </form>
      </Modal>
    </div>
  );
};

export default CustomersPatients;
