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
  Typography,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Box,
  Skeleton,
  Checkbox,
  ListItemText,
  Autocomplete,
  TextField,
} from "@mui/material";

const steps = [
  "Select campaign settings",
  "Create an ad group",
  "Create an ad",
];
function StepOne() {
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
  const [isButtonloading, setIsButtonLoading] = useState(false);
  const [affiliation, setAffiliation] = useState(null);
  const [department, setDepartment] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [procedure, setProcedure] = useState([]);
  const [affiliationData, setAffiliationData] = useState([]);
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
      console.log(affiliation);
      axiosClient
        .get(`/departments/${affiliation}`)
        .then(({ data }) => {
          setDepartmentData(data.departments);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Affiliation is not yet available.");
    }
  }, [affiliation, setDepartmentData]);

  if (loading) {
    return (
      <FormContainer>
        <Skeleton variant="rounded" width={720} height={526} />
      </FormContainer>
    );
  }

  const submit = async (ev) => {
    ev.preventDefault();
    setIsButtonLoading(true);
    setErr("");
    console.log(equipment);
  };

  const handleAffiliationChange = (event) => {
    setAffiliation(event.target.value);
  };
  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };
  const handleProcedureChange = (event) => {
    setDepartment(event.target.value);
  };
  const handleEquipmentChange = (event) => {
    const {
      target: { value },
    } = event;
    setEquipment(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <FormContainer
      sx={{ display: "flex", flexDirection: "column", width: "100%" }}
    >
      {/* <FormCard variant={"register"} className="form"> */}
      {err && (
        <Alert severity="error" sx={{ marginBottom: "1rem" }}>
          <AlertTitle>Error</AlertTitle>
          {err}
        </Alert>
      )}
      {msg && (
        <Alert severity="success" sx={{ marginBottom: "1rem" }}>
          <AlertTitle>Success</AlertTitle>
          {msg}
        </Alert>
      )}
      <form onSubmit={submit} style={{ width: "100%" }}>
        <FormTitle
          variant="h1"
          className="title"
          sx={{ width: "100%", flexBasis: "100%" }}
        >
          Surgery Details
        </FormTitle>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <Box sx={{ width: "50%" }}>
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
              name=""
              id="standard-basic"
              label="Patient BMI"
              variant="standard"
            />
            <FormTextField
              inputRef={patientDiagnosisRef}
              type="text"
              name=""
              id="standard-basic"
              label="Patient Diagnosis"
              variant="standard"
            />
            <FormTextField
              inputRef={patientComorbidityRef}
              type="text"
              name=""
              id="standard-basic"
              label="Patient Comorbidity"
              variant="standard"
            />
          </Box>
          <Box sx={{ width: "50%" }}>
            <FormTextField
              inputRef={nameRef}
              type="name"
              name=""
              id="standard-basic"
              label="Name"
              variant="standard"
              required
            />
            <FormTextField
              inputRef={slotRef}
              type="number"
              name=""
              id="standard-basic"
              label="Slots"
              variant="standard"
              required
            />
            <FormTextField
              inputRef={dateRef}
              type="date"
              name=""
              id="standard-basic"
              label="date"
              variant="standard"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormTextField
              inputRef={timeRef}
              type="time"
              name=""
              id="standard-basic"
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
              name=""
              id="standard-basic"
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
              name=""
              id="standard-basic"
              label="CPT Code"
              variant="standard"
              required
            />
            <FormTextField
              inputRef={icdCodeRef}
              type="text"
              name=""
              id="standard-basic"
              label="ICD Code"
              variant="standard"
              required
            />
          </Box>
        </Box>
        <FormButton
          variant="contained"
          className="btn btn-black"
          type="submit"
          loading={isButtonloading}
        >
          Sign-Up
        </FormButton>
      </form>
      <Typography
        variant="body2"
        className="message"
        sx={{ marginTop: "1rem", textAlign: "center" }}
      >
        Already Have An Account? <Link to="/login">Login</Link>
      </Typography>
      {/* </FormCard> */}
    </FormContainer>
  );
}

function StepTwo() {
  return <div>Step 2</div>;
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
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mt: 2 }}>
        {activeStep === 0 && <StepOne />}
        {activeStep === 1 && <stepTwo />}
        {activeStep === 2 && <div>Step 3</div>}
      </Box>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              Step {activeStep + 1}
            </Typography> */}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography
                    variant="caption"
                    sx={{ display: "inline-block" }}
                  >
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? "Finish"
                      : "Complete Step"}
                  </Button>
                ))}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
