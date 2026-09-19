import React, { useState, useEffect } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import { calculateValidTill, formatDate, getTodayDateString } from '../utils/dateUtils';
import { formatCurrency } from '../utils/cardUtils';
import { User, Phone, Armchair, Calendar, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';

const PLAN_OPTIONS = [
  { value: '1 Month', label: '1 Month (Standard)', standardFee: 800 },
  { value: '3 Months', label: '3 Months (Quarterly)', standardFee: 2100 },
  { value: '6 Months', label: '6 Months (Half-Yearly)', standardFee: 3800 },
  { value: '12 Months', label: '12 Months (Annual - Best Value)', standardFee: 7200 },
];

export default function MembershipForm({ onSubmit, isSubmitting = false }) {
  const today = getTodayDateString();

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    mobile: '',
    seatNumber: '',
    membershipPlan: '1 Month',
    feePaid: '800',
    paymentDate: today,
    joiningDate: today,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Auto-calculated Valid Till
  const calculatedValidTill = calculateValidTill(formData.joiningDate, formData.membershipPlan);

  // When plan changes, suggest standard fee if user hasn't heavily customized
  const handlePlanChange = (e) => {
    const selectedPlan = e.target.value;
    const planObj = PLAN_OPTIONS.find((p) => p.value === selectedPlan);
    setFormData((prev) => ({
      ...prev,
      membershipPlan: selectedPlan,
      feePaid: planObj ? String(planObj.standardFee) : prev.feePaid,
    }));
    if (errors.membershipPlan) {
      setErrors((prev) => ({ ...prev, membershipPlan: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Custom formatting for mobile: numeric only, max 10 digits
    if (name === 'mobile') {
      const numeric = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numeric }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear inline error if field becomes valid
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let errorMsg = '';

    switch (field) {
      case 'name':
        if (!value || !value.trim()) {
          errorMsg = 'Full name is required';
        } else if (value.trim().length < 2) {
          errorMsg = 'Please enter a valid name (at least 2 characters)';
        }
        break;

      case 'fatherName':
        if (!value || !value.trim()) {
          errorMsg = "Father's name is required";
        }
        break;

      case 'mobile':
        if (!value) {
          errorMsg = 'Mobile number is required';
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          errorMsg = 'Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)';
        }
        break;

      case 'seatNumber':
        if (!value || !value.trim()) {
          errorMsg = 'Seat number is required (e.g. A-12 or 45)';
        }
        break;

      case 'membershipPlan':
        if (!value) {
          errorMsg = 'Please select a membership plan';
        }
        break;

      case 'feePaid':
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          errorMsg = 'Enter a valid fee amount (e.g. 800)';
        }
        break;

      case 'paymentDate':
        if (!value) {
          errorMsg = 'Payment date is required';
        }
        break;

      case 'joiningDate':
        if (!value) {
          errorMsg = 'Joining date is required';
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    return !errorMsg;
  };

  const validateAll = () => {
    const fields = [
      'name',
      'fatherName',
      'mobile',
      'seatNumber',
      'membershipPlan',
      'feePaid',
      'paymentDate',
      'joiningDate',
    ];
    let isValid = true;
    const newErrors = {};

    fields.forEach((field) => {
      const val = formData[field];
      if (field === 'name' && (!val || !val.trim())) {
        newErrors.name = 'Full name is required';
        isValid = false;
      } else if (field === 'fatherName' && (!val || !val.trim())) {
        newErrors.fatherName = "Father's name is required";
        isValid = false;
      } else if (field === 'mobile' && (!val || !/^[6-9]\d{9}$/.test(val))) {
        newErrors.mobile = 'Enter a valid 10-digit Indian mobile number';
        isValid = false;
      } else if (field === 'seatNumber' && (!val || !val.trim())) {
        newErrors.seatNumber = 'Seat number is required';
        isValid = false;
      } else if (field === 'membershipPlan' && !val) {
        newErrors.membershipPlan = 'Membership plan is required';
        isValid = false;
      } else if (field === 'feePaid' && (!val || isNaN(Number(val)) || Number(val) <= 0)) {
        newErrors.feePaid = 'Enter a valid numeric fee';
        isValid = false;
      } else if (field === 'paymentDate' && !val) {
        newErrors.paymentDate = 'Payment date is required';
        isValid = false;
      } else if (field === 'joiningDate' && !val) {
        newErrors.joiningDate = 'Joining date is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      fields.reduce((acc, f) => {
        acc[f] = true;
        return acc;
      }, {})
    );

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      return;
    }

    onSubmit({
      ...formData,
      validTill: calculatedValidTill,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate>
      {/* Student Personal Details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-4.5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Information</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Official student identity details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="e.g. Suyash Mudgal"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            error={touched.name ? errors.name : ''}
            required
            autoComplete="name"
          />

          <Input
            label="Father's Name"
            name="fatherName"
            placeholder="e.g. Ramesh Chandra Mudgal"
            value={formData.fatherName}
            onChange={handleChange}
            onBlur={() => handleBlur('fatherName')}
            error={touched.fatherName ? errors.fatherName : ''}
            required
          />

          <Input
            label="Mobile Number"
            name="mobile"
            type="tel"
            placeholder="9806248236"
            value={formData.mobile}
            onChange={handleChange}
            onBlur={() => handleBlur('mobile')}
            error={touched.mobile ? errors.mobile : ''}
            prefix="+91"
            maxLength={10}
            required
            helperText="10-digit Indian mobile number"
            autoComplete="tel"
          />

          <Input
            label="Seat Number"
            name="seatNumber"
            placeholder="e.g. A-14, B-08, or 25"
            value={formData.seatNumber}
            onChange={handleChange}
            onBlur={() => handleBlur('seatNumber')}
            error={touched.seatNumber ? errors.seatNumber : ''}
            icon={Armchair}
            required
            helperText="Check seat label assigned at reception"
          />
        </div>
      </div>

      {/* Membership & Payment Details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-4.5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Membership &amp; Payment</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Plan selection and receipt confirmation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Membership Plan"
            name="membershipPlan"
            value={formData.membershipPlan}
            onChange={handlePlanChange}
            onBlur={() => handleBlur('membershipPlan')}
            options={PLAN_OPTIONS}
            error={touched.membershipPlan ? errors.membershipPlan : ''}
            required
          />

          <Input
            label="Fee Paid"
            name="feePaid"
            type="number"
            placeholder="800"
            value={formData.feePaid}
            onChange={handleChange}
            onBlur={() => handleBlur('feePaid')}
            error={touched.feePaid ? errors.feePaid : ''}
            prefix="₹"
            required
            helperText="Amount paid directly to study room desk"
          />

          <Input
            label="Payment Date"
            name="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={handleChange}
            onBlur={() => handleBlur('paymentDate')}
            error={touched.paymentDate ? errors.paymentDate : ''}
            required
          />

          <Input
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleChange}
            onBlur={() => handleBlur('joiningDate')}
            error={touched.joiningDate ? errors.joiningDate : ''}
            required
          />
        </div>

        {/* Automatic Valid Till Calculation Banner (Highlighting the core auto-calc feature) */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                Automatically Calculated Validity
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-400">
                Based on Joining Date + {formData.membershipPlan} plan
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
              Valid Till
            </span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-900 dark:text-emerald-200 tracking-tight">
              {formatDate(calculatedValidTill, 'short')}
            </span>
          </div>
        </div>
      </div>

      {/* Submission CTA */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full text-base font-bold shadow-md hover:shadow-lg"
        >
          {isSubmitting ? 'Submitting Request...' : 'Submit Membership Request'}
        </Button>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2.5">
          Your request will be routed instantly to the study room administrator for payment verification.
        </p>
      </div>
    </form>
  );
}
