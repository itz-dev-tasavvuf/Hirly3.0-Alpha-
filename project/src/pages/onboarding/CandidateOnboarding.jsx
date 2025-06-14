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
  { id: 'industries', title: 'Industries' },
  { id: 'experience', title: 'Experience Level' },
  { id: 'workType', title: 'Work Type' },
  { id: 'skills', title: 'Top Skills' },
  { id: 'location', title: 'Location' },
  { id: 'verify', title: 'Identity Verification' },
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

const CandidateOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: null,
    roles: [],
    industries: [],
    experience: '',
    workType: [],
    skills: ['', '', ''],
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
    localStorage.setItem('candidateProfile', JSON.stringify(formData));
    toast({
      title: 'Profile Created!',
      description: 'Welcome to Hirly! You will be redirected to the dashboard.',
    });
    handleNext();
    setTimeout(() => {
        navigate('/'); 
    }, 3000);
  };
  
  const renderStep = () => {
    const stepId = steps[currentStep].id;
    switch (stepId) {
      case 'info':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Let's start with the basics</h2>
            <div className="space-y-2">
              <Label className="text-gray-300">Full Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Profile Picture (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => setFormData({...formData, profilePicture: e.target.files[0]})} />
                </label>
              </div> 
            </div>
          </div>
        );
      case 'roles':
        return <MultiSelectToggle title="What roles are you interested in?" options={['Developer', 'Designer', 'Marketer', 'Product Manager', 'Sales', 'Data Scientist', 'HR']} selected={formData.roles} onChange={(value) => handleMultiSelectChange('roles', value)} />;
      case 'industries':
        return <MultiSelectToggle title="Which industries excite you?" options={['Tech', 'Healthcare', 'Gaming', 'Finance', 'E-commerce', 'Education', 'Web3']} selected={formData.industries} onChange={(value) => handleMultiSelectChange('industries', value)} />;
      case 'experience':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">What’s your experience level?</h3>
            <RadioGroup value={formData.experience} onValueChange={(value) => handleRadioChange('experience', value)} className="space-y-2">
              {['Entry', 'Mid-Level', 'Senior', 'Lead', 'Manager'].map(level => (
                <div key={level} className="flex items-center space-x-2">
                   <RadioGroupItem value={level} id={level} />
                   <Label htmlFor={level} className="text-gray-200">{level}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 'workType':
        return <MultiSelectToggle title="What kind of work are you open to?" options={['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote only']} selected={formData.workType} onChange={(value) => handleMultiSelectChange('workType', value)} />;
      case 'skills':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">What are your top 3 skills?</h3>
            <div className="space-y-3">
              <Input placeholder="e.g. JavaScript" value={formData.skills[0]} onChange={(e) => handleSkillChange(0, e.target.value)} className="bg-slate-800/50 border-slate-700 text-white" />
              <Input placeholder="e.g. Figma" value={formData.skills[1]} onChange={(e) => handleSkillChange(1, e.target.value)} className="bg-slate-800/50 border-slate-700 text-white" />
              <Input placeholder="e.g. SEO" value={formData.skills[2]} onChange={(e) => handleSkillChange(2, e.target.value)} className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Location Preference</h3>
            <Input name="location" value={formData.location} onChange={handleChange} placeholder="City, Country or 'Remote only'" className="bg-slate-800/50 border-slate-700 text-white" />
          </div>
        );
      case 'verify':
          return (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">Verify Your Identity</h2>
              <p className="text-gray-300 max-w-md mx-auto">Boost your profile by verifying your identity on the blockchain. This helps build trust with employers.</p>
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
              <h2 className="text-4xl font-bold text-white">You're All Set!</h2>
              <p className="text-gray-300 max-w-md mx-auto">Your Hirly profile is ready. Get ready to start swiping and find your next opportunity.</p>
               <img  class="w-full max-w-sm rounded-lg shadow-lg mt-4" alt="Animated tutorial showing how to swipe on job cards" src="https://images.unsplash.com/photo-1659841135771-727afd559f49" />
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
                            Finish & Find a Job
                        </Button>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default CandidateOnboarding;