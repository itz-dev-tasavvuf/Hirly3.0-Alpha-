import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import ProgressBar from '@/components/onboarding/ProgressBar';
import MultiSelectToggle from '@/components/onboarding/MultiSelectToggle';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Upload, PartyPopper } from 'lucide-react';

const steps = [
  { id: 'info', title: 'Basic Info' },
  { id: 'roles', title: 'Roles' },
  { id: 'skills', title: 'Key Skills' },
  { id: 'experience', title: 'Experience Level' },
  { id: 'workSetup', title: 'Work Setup' },
  { id: 'timeCommitment', title: 'Time Commitment' },
  { id: 'location', title: 'Location' },
  { id: 'verify', title: 'Company Verification' },
  { id: 'complete', title: 'Complete' },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const EmployerOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    logo: null,
    roles: [],
    skills: ['', '', '', '', ''],
    experience: '',
    workSetup: '',
    timeCommitment: [],
    location: '',
  });

  const handleNext = () => {
    setDirection(1);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/signup');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const handleFinish = () => {
    localStorage.setItem('employerProfile', JSON.stringify(formData));
    toast({
      title: 'Company Profile Created!',
      description: 'Welcome to Hirly! You can now start posting jobs and find candidates.',
    });
    sessionStorage.setItem('onboardingComplete', 'true');
    navigate('/hub');
  };
  
  const renderStep = () => {
    const stepId = steps[currentStep].id;
    switch (stepId) {
      case 'info':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Tell us about your company</h2>
            <div className="space-y-2">
              <Label className="text-gray-300">Company Name</Label>
              <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Innovate Inc." className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Your Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Jane Smith" className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Work Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@innovate.com" className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
          </div>
        );
      case 'roles':
        return <MultiSelectToggle title="What role(s) are you hiring for?" options={['Backend Developer', 'UI/UX Designer', 'Growth Marketer', 'Product Manager', 'Data Analyst']} selected={formData.roles} onChange={(value) => handleMultiSelectChange('roles', value)} />;
      case 'skills':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">What are the key skills required? (up to 5)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(5)].map((_, i) => (
                <Input key={i} placeholder={`Skill ${i+1}`} value={formData.skills[i]} onChange={(e) => handleSkillChange(i, e.target.value)} className="bg-slate-800/50 border-slate-700 text-white" />
              ))}
            </div>
          </div>
        );
      case 'experience':
        return (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">What level of experience are you looking for?</h3>
              <RadioGroup value={formData.experience} onValueChange={(value) => handleRadioChange('experience', value)} className="space-y-2">
                {['Junior', 'Mid-Level', 'Senior'].map(level => (
                  <div key={level} className="flex items-center space-x-2">
                     <RadioGroupItem value={level} id={level} />
                     <Label htmlFor={level} className="text-gray-200">{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
        );
      case 'workSetup':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Work setup</h3>
            <RadioGroup value={formData.workSetup} onValueChange={(value) => handleRadioChange('workSetup', value)} className="space-y-2">
              {['Remote', 'Hybrid', 'Onsite'].map(setup => (
                <div key={setup} className="flex items-center space-x-2">
                   <RadioGroupItem value={setup} id={setup} />
                   <Label htmlFor={setup} className="text-gray-200">{setup}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 'timeCommitment':
        return <MultiSelectToggle title="Time Commitment" options={['Full-time', 'Part-time', 'Freelance', 'Internship']} selected={formData.timeCommitment} onChange={(value) => handleMultiSelectChange('timeCommitment', value)} />;
      case 'location':
        return (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Location or timezone preference</h3>
              <Input name="location" value={formData.location} onChange={handleChange} placeholder="e.g., San Francisco, CA or GMT-5" className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
          );
      case 'verify':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">Verify Your Company</h2>
            <p className="text-gray-300 max-w-md mx-auto">Increase trust and attract better candidates by verifying your company on the blockchain.</p>
            <div className="flex items-center justify-center space-x-2 my-4">
                <img  alt="Algorand logo" className="w-6 h-6" src="https://images.unsplash.com/photo-1639327380086-f13b8fef4211" />
                <span className="text-green-400 font-medium">Powered by Algorand</span>
            </div>
            <div className="space-y-4">
                <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white" onClick={() => toast({ title: "Feature coming soon!" })}>Start Verification</Button>
                <Button variant="link" className="text-purple-400" onClick={handleNext}>Skip for now</Button>
            </div>
          </div>
        );
      case 'complete':
          return(
            <div className="text-center space-y-6 flex flex-col items-center">
              <PartyPopper className="w-24 h-24 text-yellow-400" />
              <h2 className="text-4xl font-bold text-white">You're Ready to Hire!</h2>
              <p className="text-gray-300 max-w-md mx-auto">Your company profile is live. Start posting jobs and discover top talent.</p>
               <img  class="w-full max-w-sm rounded-lg shadow-lg mt-4" alt="Animated tutorial showing how to swipe on candidate cards" src="https://images.unsplash.com/photo-1659841135771-727afd559f49" />
            </div>
          )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <ProgressBar currentStep={currentStep} totalSteps={steps.length - 1} />
        <div className="relative h-[500px] w-full">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="absolute w-full h-full p-1"
                >
                  <div className="glass-effect p-8 rounded-2xl w-full h-full overflow-y-auto">
                    {renderStep()}
                  </div>
                </motion.div>
            </AnimatePresence>
        </div>
        
        {steps[currentStep].id !== 'complete' && (
            <div className="flex justify-between items-center w-full">
                <Button variant="ghost" onClick={handleBack} className="text-white hover:bg-white/10">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {currentStep === 0 ? 'Back to Selection' : 'Back'}
                </Button>
                {currentStep < steps.length - 2 ? (
                    <Button onClick={handleNext} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold">
                        Next
                    </Button>
                ) : (
                    <Button onClick={handleFinish} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold">
                        Finish & Find Talent
                    </Button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default EmployerOnboarding;