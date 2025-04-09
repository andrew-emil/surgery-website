import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import {
  FormButton,
  FormContainer,
  FormTextField,
  FormTitle,
} from "../components/StyledComponents";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import AlertTitle from "@mui/material/AlertTitle";
import {
  Alert,
  Box,
  Skeleton,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Checkbox,
  ListItemText,
} from "@mui/material";

const steps = [
  "Select campaign settings",
  "Create an ad group",
  "Create an ad",
];

let payload = {};

function StepOne({ onComplete }) {
  const nameRef = useRef();
  const slotRef = useRef();
  const dateRef = useRef();
  const timeRef = useRef();
  const estimatedEndTimeRef = useRef();
  const cptCodeRef = useRef();
  const icdCodeRef = useRef();
  const patientBmiRef = useRef();
  const patientComorbidityRef = useRef();
  const patientDiagnosisRef = useRef();

  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [affiliation, setAffiliation] = useState(null);
  const [department, setDepartment] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [procedure, setProcedure] = useState([]);
  const [affiliationData, setAffiliationData] = useState([]);
  const [patientComorbidityData, setPatientComorbidityData] = useState([]);
  const [procedureTypeData, setProcedureTypeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/affiliation")
      .then(({ data }) => {
        setAffiliationData(data.affiliations);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/surgery-equipments", { withCredentials: true })
      .then(({ data }) => {
        setEquipmentData(data.equipments);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/procedure-types", { withCredentials: true })
      .then(({ data }) => {
        setProcedureTypeData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (affiliation) {
      axiosClient
        .get(`/departments/${affiliation}`)
        .then(({ data }) => {
          setDepartmentData(data.departments);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [affiliation]);

  if (loading) {
    return (
      <FormContainer>
        <Skeleton variant="rounded" width={720} height={526} />
      </FormContainer>
    );
  }

  const validateFields = () => {
    const newErrors = {};
    if (!nameRef.current.value) newErrors.name = "Name is required";
    if (!slotRef.current.value) newErrors.slots = "Slots are required";
    if (!dateRef.current.value) newErrors.date = "Date is required";
    if (!timeRef.current.value) newErrors.time = "Time is required";
    if (!estimatedEndTimeRef.current.value)
      newErrors.estimatedEndTime = "Estimated end time is required";
    if (!cptCodeRef.current.value) newErrors.cptCode = "CPT Code is required";
    if (!icdCodeRef.current.value) newErrors.icdCode = "ICD Code is required";
    if (!affiliation) newErrors.affiliation = "Affiliation is required";
    if (!department) newErrors.department = "Department is required";
    if (!procedure) newErrors.procedure = "Procedure is required";

    setErr(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const collectPayload = () => {
    if (!validateFields()) return;

    payload = {
      name: nameRef.current.value,
      slots: slotRef.current.value,
      date: dateRef.current.value,
      time: timeRef.current.value,
      estimatedEndTime: estimatedEndTimeRef.current.value,
      cptCode: cptCodeRef.current.value,
      icdCode: icdCodeRef.current.value,
      patientBmi: patientBmiRef.current.value,
      patientDiagnosis: patientDiagnosisRef.current.value,
      patientComorbidity: patientComorbidityData,
      affiliation,
      department,
      equipment,
      procedure,
    };
    onComplete();
  };

  const handleAffiliationChange = (event) => {
    setAffiliation(event.target.value);
  };
  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };
  const handleProcedureChange = (event) => {
    setProcedure(event.target.value);
  };
  const handleEquipmentChange = (event) => {
    const {
      target: { value },
    } = event;
    setEquipment(typeof value === "string" ? value.split(",") : value);
  };
  const handlePatientComorbidityChange = (ev) => {
    ev.preventDefault();
    const comorbidityArray = patientComorbidityRef.current.value.split(",");
    setPatientComorbidityData(comorbidityArray);
  };

  return (
    <FormContainer
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "70%",
      }}
    >
      {err && (
        <Alert severity="error" sx={{ marginBottom: "1rem" }}>
          <AlertTitle>Error</AlertTitle>
          {Object.values(err).join(", ")}
        </Alert>
      )}
      {msg && (
        <Alert severity="success" sx={{ marginBottom: "1rem" }}>
          <AlertTitle>Success</AlertTitle>
          {msg}
        </Alert>
      )}
      <form style={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: "1rem",
          }}
        >
          <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
            <FormTextField
              inputRef={nameRef}
              type="name"
              label="Name"
              variant="standard"
              required
            />
            <FormTextField
              inputRef={slotRef}
              type="number"
              label="Slots"
              variant="standard"
              required
            />
            <FormTextField
              inputRef={dateRef}
              type="date"
              label="Date"
              variant="standard"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormTextField
              inputRef={timeRef}
              type="time"
              label="Time"
              variant="standard"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormTextField
              inputRef={estimatedEndTimeRef}
              type="time"
              label="Estimated End Time"
              variant="standard"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormTextField
              inputRef={cptCodeRef}
              type="text"
              label="CPT Code"
              variant="standard"
              required
            />
            <FormTextField
              inputRef={icdCodeRef}
              type="text"
              label="ICD Code"
              variant="standard"
              required
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
            <FormControl variant="standard" sx={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Affiliations
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={affiliation}
                onChange={handleAffiliationChange}
                label="Affiliation"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {affiliationData.map((affiliation) => (
                  <MenuItem key={affiliation.id} value={affiliation.id}>
                    {affiliation.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="standard"
              sx={{ minWidth: "100%", marginTop: "1rem" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Departments
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={department}
                onChange={handleDepartmentChange}
                label="Department"
                disabled={departmentData.length === 0}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {departmentData.length > 0 ? (
                  departmentData.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem></MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl
              variant="standard"
              sx={{ minWidth: "100%", marginTop: "1rem" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Procedure Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={procedure}
                onChange={handleProcedureChange}
                label="Procedure Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {procedureTypeData.length > 0 ? (
                  procedureTypeData.map((procedure) => (
                    <MenuItem key={procedure.id} value={procedure.id}>
                      {procedure.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem></MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl
              variant="standard"
              sx={{ minWidth: "100%", marginTop: "1rem", marginBottom: "1rem" }}
            >
              <InputLabel id="demo-multiple-checkbox-label">
                Equipments
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={equipment}
                onChange={handleEquipmentChange}
                renderValue={(selected) => selected.join(", ")}
                label="Equipment"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {equipmentData.length > 0 ? (
                  equipmentData.map((eq) => (
                    <MenuItem key={eq.equipment_name} value={eq.equipment_name}>
                      <Checkbox
                        checked={equipment.includes(eq.equipment_name)}
                      />
                      <ListItemText primary={eq.equipment_name} />
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem></MenuItem>
                )}
              </Select>
            </FormControl>
            <FormTextField
              inputRef={patientBmiRef}
              type="number"
              label="Patient BMI"
              variant="standard"
            />
            <FormTextField
              inputRef={patientDiagnosisRef}
              type="text"
              label="Patient Diagnosis"
              variant="standard"
            />
            <FormTextField
              inputRef={patientComorbidityRef}
              onBlur={handlePatientComorbidityChange}
              type="text"
              label="Patient Comorbidity"
              placeholder="Example: Hypertension, Diabetes"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </Box>
      </form>
      <Button variant="contained" sx={{ mt: 3 }} onClick={collectPayload}>
        Complete Step
      </Button>
    </FormContainer>
  );
}

function StepTwo() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Step 2 - Payload Preview</Typography>
      <pre style={{ background: "#f5f5f5", padding: "1rem" }}>
        {JSON.stringify(payload, null, 2)}
      </pre>
    </Box>
  );
}

export default function HorizontalNonLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted({ ...completed, [activeStep]: true });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStep(index)}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {activeStep === 0 && <StepOne onComplete={handleComplete} />}
        {activeStep === 1 && <StepTwo />}
        {activeStep === 2 && <Typography>All steps completed</Typography>}

        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ width: "auto", marginTop: "1rem" }}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
