import { useState } from "react";

type OffenseCategory =
  | "murder1"
  | "murder2"
  | "armedRobbery"
  | "drugTrafficking"
  | "drugPossession"
  | "burglary"
  | "aggAssault"
  | "sexualAssault"
  | "grandTheft";

interface SentenceRange {
  min: string;
  max: string;
  paroleEligible: string;
  notes: string;
}

interface StateData {
  offenses: Partial<Record<OffenseCategory, SentenceRange>>;
  paroleBoard: string;
  paroleUrl: string;
}

const OFFENSE_LABELS: Record<OffenseCategory, string> = {
  murder1: "Murder 1st Degree",
  murder2: "Murder 2nd Degree",
  armedRobbery: "Armed Robbery",
  drugTrafficking: "Drug Trafficking",
  drugPossession: "Drug Possession (Felony)",
  burglary: "Burglary / Breaking & Entering",
  aggAssault: "Aggravated Assault",
  sexualAssault: "Sexual Assault / Rape",
  grandTheft: "Grand Theft / Grand Larceny",
};

const STATE_DATA: Record<string, StateData> = {
  Alabama: {
    paroleBoard: "Alabama Board of Pardons and Paroles",
    paroleUrl: "https://www.alabamapardon.state.al.us",
    offenses: {
      murder1: { min: "10 yrs", max: "Life / Death", paroleEligible: "After 10 yrs (if not life)", notes: "Capital murder carries death penalty or LWOP" },
      murder2: { min: "20 yrs", max: "99 yrs / Life", paroleEligible: "After 20 yrs", notes: "" },
      armedRobbery: { min: "10 yrs", max: "99 yrs / Life", paroleEligible: "After 10 yrs", notes: "Firearm enhancement applies" },
      drugTrafficking: { min: "3 yrs", max: "Life", paroleEligible: "Varies by weight", notes: "Mandatory minimums based on quantity" },
      drugPossession: { min: "1 yr", max: "10 yrs", paroleEligible: "After serving minimum", notes: "Class C felony" },
      burglary: { min: "2 yrs", max: "20 yrs", paroleEligible: "After minimum", notes: "1st degree if someone present" },
      aggAssault: { min: "2 yrs", max: "20 yrs", paroleEligible: "After minimum", notes: "Class C felony" },
      sexualAssault: { min: "10 yrs", max: "99 yrs / Life", paroleEligible: "After 10 yrs", notes: "Sex offender registration required" },
      grandTheft: { min: "1 yr", max: "10 yrs", paroleEligible: "After minimum", notes: "$500+ threshold" },
    },
  },
  Alaska: {
    paroleBoard: "Alaska Board of Parole",
    paroleUrl: "https://www.correct.state.ak.us/parole",
    offenses: {
      murder1: { min: "20 yrs", max: "99 yrs", paroleEligible: "After 20 yrs", notes: "Unclassified felony" },
      murder2: { min: "10 yrs", max: "99 yrs", paroleEligible: "After 10 yrs", notes: "Class A felony" },
      armedRobbery: { min: "5 yrs", max: "99 yrs", paroleEligible: "After 5 yrs", notes: "Class A felony" },
      drugTrafficking: { min: "5 yrs", max: "99 yrs", paroleEligible: "After 5 yrs", notes: "Class A felony" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Class B or C felony" },
      burglary: { min: "1 yr", max: "10 yrs", paroleEligible: "After minimum", notes: "Class B felony" },
      aggAssault: { min: "2 yrs", max: "20 yrs", paroleEligible: "After minimum", notes: "Class B felony" },
      sexualAssault: { min: "8 yrs", max: "30 yrs", paroleEligible: "After minimum", notes: "1st degree; registration required" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "$750+ threshold" },
    },
  },
  Arizona: {
    paroleBoard: "Arizona Board of Executive Clemency",
    paroleUrl: "https://bec.az.gov",
    offenses: {
      murder1: { min: "25 yrs", max: "Life / Death", paroleEligible: "After 25 yrs (if not LWOP)", notes: "Death penalty state" },
      murder2: { min: "10 yrs", max: "25 yrs", paroleEligible: "After 85% served", notes: "Truth-in-sentencing state" },
      armedRobbery: { min: "7 yrs", max: "21 yrs", paroleEligible: "After 85% served", notes: "Dangerous offense enhancement" },
      drugTrafficking: { min: "5 yrs", max: "15 yrs", paroleEligible: "After 85% served", notes: "Mandatory minimums apply" },
      drugPossession: { min: "1.5 yrs", max: "3 yrs", paroleEligible: "After 85% served", notes: "Class 4 felony" },
      burglary: { min: "1.5 yrs", max: "6.5 yrs", paroleEligible: "After 85% served", notes: "1st degree; residential" },
      aggAssault: { min: "1.5 yrs", max: "15 yrs", paroleEligible: "After 85% served", notes: "Dangerous offense adds time" },
      sexualAssault: { min: "5.25 yrs", max: "14 yrs", paroleEligible: "After 85% served", notes: "Registration required; no early release" },
      grandTheft: { min: "1 yr", max: "3.75 yrs", paroleEligible: "After 85% served", notes: "$1,000+ threshold" },
    },
  },
  Arkansas: {
    paroleBoard: "Arkansas Parole Board",
    paroleUrl: "https://paroleboard.arkansas.gov",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Parole after life term rarely granted", notes: "Capital murder carries death" },
      murder2: { min: "10 yrs", max: "40 yrs", paroleEligible: "After 10 yrs", notes: "Class A felony" },
      armedRobbery: { min: "6 yrs", max: "30 yrs", paroleEligible: "After 1/3 served", notes: "Class B felony" },
      drugTrafficking: { min: "3 yrs", max: "20 yrs", paroleEligible: "After 1/3 served", notes: "Mandatory minimums" },
      drugPossession: { min: "1 yr", max: "6 yrs", paroleEligible: "After minimum", notes: "Class D felony" },
      burglary: { min: "5 yrs", max: "20 yrs", paroleEligible: "After 1/3 served", notes: "Class B felony" },
      aggAssault: { min: "3 yrs", max: "10 yrs", paroleEligible: "After minimum", notes: "Class C felony" },
      sexualAssault: { min: "5 yrs", max: "20 yrs", paroleEligible: "After minimum", notes: "Registration required" },
      grandTheft: { min: "1 yr", max: "6 yrs", paroleEligible: "After minimum", notes: "$1,000+ threshold" },
    },
  },
  California: {
    paroleBoard: "California Board of Parole Hearings",
    paroleUrl: "https://www.cdcr.ca.gov/parole",
    offenses: {
      murder1: { min: "25 yrs", max: "Life / Death", paroleEligible: "After 25 yrs (parole board review)", notes: "Death penalty currently on moratorium" },
      murder2: { min: "15 yrs", max: "Life", paroleEligible: "After 15 yrs", notes: "Parole board determines release" },
      armedRobbery: { min: "3 yrs", max: "9 yrs", paroleEligible: "After minimum", notes: "Firearm use adds 3-10 yrs" },
      drugTrafficking: { min: "3 yrs", max: "9 yrs", paroleEligible: "After minimum", notes: "Prop 47 reduced many offenses" },
      drugPossession: { min: "16 mos", max: "3 yrs", paroleEligible: "After minimum", notes: "Often treated as misdemeanor (Prop 47)" },
      burglary: { min: "16 mos", max: "6 yrs", paroleEligible: "After minimum", notes: "Residential 1st degree" },
      aggAssault: { min: "2 yrs", max: "4 yrs", paroleEligible: "After minimum", notes: "Firearm adds substantial time" },
      sexualAssault: { min: "3 yrs", max: "8 yrs", paroleEligible: "After minimum", notes: "Registration required; civil commitment possible" },
      grandTheft: { min: "16 mos", max: "3 yrs", paroleEligible: "After minimum", notes: "$950+ threshold" },
    },
  },
  Colorado: {
    paroleBoard: "Colorado State Board of Parole",
    paroleUrl: "https://cdoc.colorado.gov/parole-board",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Rare; board discretion", notes: "Death penalty available" },
      murder2: { min: "16 yrs", max: "48 yrs", paroleEligible: "After mandatory period", notes: "Class 2 felony" },
      armedRobbery: { min: "8 yrs", max: "24 yrs", paroleEligible: "After mandatory period", notes: "Class 3 felony" },
      drugTrafficking: { min: "4 yrs", max: "16 yrs", paroleEligible: "After mandatory period", notes: "Class 3 felony" },
      drugPossession: { min: "1 yr", max: "3 yrs", paroleEligible: "After minimum", notes: "Class 6 felony; treatment may be offered" },
      burglary: { min: "4 yrs", max: "16 yrs", paroleEligible: "After mandatory period", notes: "1st degree residential" },
      aggAssault: { min: "5 yrs", max: "16 yrs", paroleEligible: "After mandatory period", notes: "Class 3 felony" },
      sexualAssault: { min: "4 yrs", max: "Life", paroleEligible: "Board discretion", notes: "Indeterminate sentence; registration required" },
      grandTheft: { min: "1 yr", max: "4.5 yrs", paroleEligible: "After minimum", notes: "$2,000+ threshold" },
    },
  },
  Connecticut: {
    paroleBoard: "Connecticut Board of Pardons and Paroles",
    paroleUrl: "https://portal.ct.gov/BOPP",
    offenses: {
      murder1: { min: "25 yrs", max: "Life", paroleEligible: "After 25 yrs", notes: "Class A felony" },
      murder2: { min: "10 yrs", max: "Life", paroleEligible: "After 10 yrs", notes: "Class A felony" },
      armedRobbery: { min: "5 yrs", max: "20 yrs", paroleEligible: "After 50% served", notes: "Class B felony" },
      drugTrafficking: { min: "5 yrs", max: "20 yrs", paroleEligible: "After 50% served", notes: "Mandatory minimums" },
      drugPossession: { min: "0", max: "7 yrs", paroleEligible: "After minimum", notes: "Class D felony" },
      burglary: { min: "1 yr", max: "20 yrs", paroleEligible: "After 50% served", notes: "Class B felony (1st degree)" },
      aggAssault: { min: "1 yr", max: "20 yrs", paroleEligible: "After 50% served", notes: "Class B/C felony" },
      sexualAssault: { min: "5 yrs", max: "Life", paroleEligible: "Board discretion", notes: "Registration required" },
      grandTheft: { min: "1 yr", max: "10 yrs", paroleEligible: "After 50% served", notes: "$2,000+ threshold" },
    },
  },
  Delaware: {
    paroleBoard: "Delaware Board of Parole",
    paroleUrl: "https://doc.delaware.gov/boards/parole.shtml",
    offenses: {
      murder1: { min: "Life", max: "Death / Life", paroleEligible: "No parole for murder 1", notes: "Mandatory LWOP" },
      murder2: { min: "15 yrs", max: "Life", paroleEligible: "Board discretion after min", notes: "Class A felony" },
      armedRobbery: { min: "2 yrs", max: "25 yrs", paroleEligible: "After minimum", notes: "Class C felony" },
      drugTrafficking: { min: "3 yrs", max: "Life", paroleEligible: "After minimum", notes: "Mandatory minimum by quantity" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Class E felony" },
      burglary: { min: "2 yrs", max: "15 yrs", paroleEligible: "After minimum", notes: "Class D felony (1st degree)" },
      aggAssault: { min: "0", max: "8 yrs", paroleEligible: "After minimum", notes: "Class D felony" },
      sexualAssault: { min: "2 yrs", max: "Life", paroleEligible: "Board discretion", notes: "Registration required" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "$1,500+ threshold" },
    },
  },
  Florida: {
    paroleBoard: "Florida Commission on Offender Review",
    paroleUrl: "https://www.fcor.state.fl.us",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "No parole for 1st degree (post-1983)", notes: "Death penalty state; 85% rule" },
      murder2: { min: "16.75 yrs", max: "Life", paroleEligible: "After 85% served", notes: "Sentencing guidelines apply" },
      armedRobbery: { min: "21.15 yrs", max: "Life", paroleEligible: "After 85% served", notes: "10-20-Life law applies" },
      drugTrafficking: { min: "3 yrs", max: "Life", paroleEligible: "After 85% served", notes: "Mandatory minimums by weight" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "After 85% served", notes: "3rd degree felony" },
      burglary: { min: "0", max: "15 yrs", paroleEligible: "After 85% served", notes: "1st degree carries up to life" },
      aggAssault: { min: "0", max: "5 yrs", paroleEligible: "After 85% served", notes: "3rd degree felony" },
      sexualAssault: { min: "9.75 yrs", max: "Life", paroleEligible: "After 85% served", notes: "Registration required; Jimmy Ryce Act" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "After 85% served", notes: "$750+ threshold" },
    },
  },
  Georgia: {
    paroleBoard: "State Board of Pardons and Paroles",
    paroleUrl: "https://pap.georgia.gov",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Board discretion after 30 yrs", notes: "Death penalty state" },
      murder2: { min: "10 yrs", max: "Life", paroleEligible: "Board discretion", notes: "Class A felony" },
      armedRobbery: { min: "10 yrs", max: "20 yrs / Life", paroleEligible: "Board discretion", notes: "No parole for armed robbery first 10 yrs" },
      drugTrafficking: { min: "5 yrs", max: "Life", paroleEligible: "After mandatory minimum", notes: "Mandatory minimum by quantity" },
      drugPossession: { min: "1 yr", max: "10 yrs", paroleEligible: "Board discretion", notes: "Class C felony" },
      burglary: { min: "1 yr", max: "20 yrs", paroleEligible: "Board discretion", notes: "1st degree" },
      aggAssault: { min: "1 yr", max: "20 yrs", paroleEligible: "Board discretion", notes: "Class C felony" },
      sexualAssault: { min: "25 yrs", max: "Life", paroleEligible: "After 25 yrs; board review", notes: "Registration required; mandatory minimums" },
      grandTheft: { min: "1 yr", max: "10 yrs", paroleEligible: "Board discretion", notes: "$1,500+ threshold" },
    },
  },
  Hawaii: {
    paroleBoard: "Hawaii Paroling Authority",
    paroleUrl: "https://dps.hawaii.gov/hpa",
    offenses: {
      murder1: { min: "Life", max: "Life", paroleEligible: "After minimum term set by authority", notes: "Class A felony" },
      murder2: { min: "Life", max: "Life", paroleEligible: "Authority sets minimum", notes: "Class A felony" },
      armedRobbery: { min: "20 yrs", max: "Life", paroleEligible: "Authority sets minimum", notes: "Class A felony" },
      drugTrafficking: { min: "20 yrs", max: "Life", paroleEligible: "Authority sets minimum", notes: "Class A felony" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Class C felony" },
      burglary: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "Class B felony (1st degree)" },
      aggAssault: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "Class B felony" },
      sexualAssault: { min: "20 yrs", max: "Life", paroleEligible: "Authority sets minimum", notes: "Class A felony; registration required" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "$300+ threshold for Class C" },
    },
  },
  Idaho: {
    paroleBoard: "Idaho Commission of Pardons and Parole",
    paroleUrl: "https://icp.idaho.gov",
    offenses: {
      murder1: { min: "Life", max: "Death / Life", paroleEligible: "Board discretion", notes: "Death penalty state" },
      murder2: { min: "10 yrs", max: "Life", paroleEligible: "After 10 yrs; board review", notes: "Fixed/indeterminate sentence" },
      armedRobbery: { min: "5 yrs", max: "Life", paroleEligible: "After 5 yrs; board review", notes: "Fixed/indeterminate" },
      drugTrafficking: { min: "3 yrs", max: "Life", paroleEligible: "After 3 yrs; board review", notes: "Mandatory minimums" },
      drugPossession: { min: "0", max: "7 yrs", paroleEligible: "After minimum", notes: "Class C felony" },
      burglary: { min: "1 yr", max: "Life", paroleEligible: "After minimum", notes: "Indeterminate; judge sets fixed term" },
      aggAssault: { min: "0", max: "Life", paroleEligible: "After minimum", notes: "Indeterminate sentence" },
      sexualAssault: { min: "1 yr", max: "Life", paroleEligible: "After minimum", notes: "Registration required" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "$1,000+ threshold" },
    },
  },
  Illinois: {
    paroleBoard: "Illinois Prisoner Review Board",
    paroleUrl: "https://prb.illinois.gov",
    offenses: {
      murder1: { min: "20 yrs", max: "Life / Death", paroleEligible: "After 20 yrs (natural life if no parole)", notes: "Truth-in-sentencing; 100% for murder" },
      murder2: { min: "4 yrs", max: "20 yrs", paroleEligible: "After 100% served", notes: "Class M felony" },
      armedRobbery: { min: "6 yrs", max: "30 yrs", paroleEligible: "After 85% served", notes: "Class X felony" },
      drugTrafficking: { min: "6 yrs", max: "30 yrs", paroleEligible: "After 85% served", notes: "Class X mandatory minimums" },
      drugPossession: { min: "1 yr", max: "3 yrs", paroleEligible: "After 50% served", notes: "Class 4 felony" },
      burglary: { min: "3 yrs", max: "7 yrs", paroleEligible: "After 50% served", notes: "Class 2 felony" },
      aggAssault: { min: "3 yrs", max: "7 yrs", paroleEligible: "After 50% served", notes: "Class 3 felony" },
      sexualAssault: { min: "4 yrs", max: "15 yrs", paroleEligible: "After 85% served", notes: "Class 1 felony; registration required" },
      grandTheft: { min: "2 yrs", max: "5 yrs", paroleEligible: "After 50% served", notes: "$500+ threshold" },
    },
  },
  Indiana: {
    paroleBoard: "Indiana Parole Board",
    paroleUrl: "https://www.in.gov/idoc/2411.htm",
    offenses: {
      murder1: { min: "45 yrs", max: "65 yrs / Death", paroleEligible: "Board discretion after mandatory", notes: "Death penalty state" },
      murder2: { min: "10 yrs", max: "40 yrs", paroleEligible: "After mandatory period", notes: "Level 1 felony" },
      armedRobbery: { min: "10 yrs", max: "30 yrs", paroleEligible: "After mandatory period", notes: "Level 2 felony" },
      drugTrafficking: { min: "3 yrs", max: "20 yrs", paroleEligible: "After mandatory period", notes: "Level 3 felony" },
      drugPossession: { min: "0", max: "6 yrs", paroleEligible: "Eligible", notes: "Level 5 felony" },
      burglary: { min: "1 yr", max: "12 yrs", paroleEligible: "After mandatory period", notes: "Level 4 felony" },
      aggAssault: { min: "3 yrs", max: "16 yrs", paroleEligible: "After mandatory period", notes: "Level 3 felony" },
      sexualAssault: { min: "6 yrs", max: "20 yrs", paroleEligible: "After mandatory period", notes: "Level 1 or 2 felony; registration required" },
      grandTheft: { min: "0", max: "6 yrs", paroleEligible: "Eligible", notes: "$750+ threshold" },
    },
  },
  Iowa: {
    paroleBoard: "Iowa Board of Parole",
    paroleUrl: "https://bop.iowa.gov",
    offenses: {
      murder1: { min: "Life", max: "Life", paroleEligible: "After 25 yrs; board review", notes: "Class A felony" },
      murder2: { min: "12.5 yrs", max: "25 yrs", paroleEligible: "After minimum", notes: "Class B felony" },
      armedRobbery: { min: "5 yrs", max: "25 yrs", paroleEligible: "After minimum", notes: "Class B felony" },
      drugTrafficking: { min: "5 yrs", max: "25 yrs", paroleEligible: "After minimum", notes: "Class B felony" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Class D felony" },
      burglary: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "Class C felony (1st degree)" },
      aggAssault: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Class D felony" },
      sexualAssault: { min: "10 yrs", max: "Life", paroleEligible: "Board review after minimum", notes: "Registration required" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "$1,500+ threshold" },
    },
  },
  Kansas: {
    paroleBoard: "Kansas Prisoner Review Board",
    paroleUrl: "https://doc.ks.gov/prb",
    offenses: {
      murder1: { min: "25 yrs", max: "Life", paroleEligible: "Board review after 25 yrs", notes: "Death penalty available" },
      murder2: { min: "12 yrs 3 mos", max: "Life", paroleEligible: "After mandatory minimum", notes: "Severity Level 1" },
      armedRobbery: { min: "5 yrs 1 mo", max: "23 yrs 3 mos", paroleEligible: "After mandatory minimum", notes: "Severity Level 3" },
      drugTrafficking: { min: "46 mos", max: "83 mos", paroleEligible: "After mandatory minimum", notes: "Level 1 drug felony" },
      drugPossession: { min: "0", max: "42 mos", paroleEligible: "Eligible", notes: "Level 4 drug offense" },
      burglary: { min: "11 mos", max: "34 mos", paroleEligible: "Eligible", notes: "Severity Level 7" },
      aggAssault: { min: "31 mos", max: "136 mos", paroleEligible: "After minimum", notes: "Severity Level 4-5" },
      sexualAssault: { min: "55 mos", max: "Life", paroleEligible: "Jessica's Law for child victims", notes: "Registration required" },
      grandTheft: { min: "11 mos", max: "34 mos", paroleEligible: "Eligible", notes: "$1,500+ threshold" },
    },
  },
  Kentucky: {
    paroleBoard: "Kentucky Parole Board",
    paroleUrl: "https://corrections.ky.gov/Facilities/Pages/ParoleBoard.aspx",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "After 25 yrs (board review)", notes: "Capital offense" },
      murder2: { min: "10 yrs", max: "20 yrs", paroleEligible: "After minimum", notes: "Class B felony" },
      armedRobbery: { min: "10 yrs", max: "20 yrs", paroleEligible: "After minimum", notes: "Class B felony" },
      drugTrafficking: { min: "5 yrs", max: "10 yrs", paroleEligible: "After minimum", notes: "Class C/D felony" },
      drugPossession: { min: "1 yr", max: "5 yrs", paroleEligible: "Eligible", notes: "Class D felony" },
      burglary: { min: "1 yr", max: "5 yrs", paroleEligible: "Eligible", notes: "Class D felony (3rd degree)" },
      aggAssault: { min: "5 yrs", max: "10 yrs", paroleEligible: "Eligible", notes: "Class C felony" },
      sexualAssault: { min: "10 yrs", max: "20 yrs", paroleEligible: "After minimum", notes: "Registration required" },
      grandTheft: { min: "1 yr", max: "5 yrs", paroleEligible: "Eligible", notes: "$500+ threshold" },
    },
  },
  Louisiana: {
    paroleBoard: "Louisiana Board of Pardons and Committee on Parole",
    paroleUrl: "https://doc.louisiana.gov/inmates-families/parole",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "No parole unless commuted", notes: "Mandatory LWOP or death" },
      murder2: { min: "Life", max: "Life", paroleEligible: "After 25 yrs (if under 18 at crime)", notes: "Mandatory LWOP for adults" },
      armedRobbery: { min: "10 yrs", max: "99 yrs", paroleEligible: "No parole mandatory period", notes: "No probation, parole, suspension" },
      drugTrafficking: { min: "5 yrs", max: "Life", paroleEligible: "After mandatory minimum", notes: "Mandatory minimums by weight" },
      drugPossession: { min: "0", max: "10 yrs", paroleEligible: "After minimum", notes: "Class C felony equivalent" },
      burglary: { min: "1 yr", max: "12 yrs", paroleEligible: "After minimum", notes: "Simple burglary" },
      aggAssault: { min: "1 yr", max: "10 yrs", paroleEligible: "After minimum", notes: "Aggravated assault w/ weapon" },
      sexualAssault: { min: "25 yrs", max: "Life", paroleEligible: "Board review after 25 yrs", notes: "Registration; chemical castration possible" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "After minimum", notes: "$1,000+ threshold" },
    },
  },
  Maine: {
    paroleBoard: "Maine Board of Parole (abolished 1976 — supervised release only)",
    paroleUrl: "https://www.maine.gov/corrections",
    offenses: {
      murder1: { min: "25 yrs", max: "Life", paroleEligible: "No parole — determinate sentences", notes: "Maine abolished parole in 1976" },
      murder2: { min: "25 yrs", max: "Life", paroleEligible: "Determinate", notes: "Class A crime" },
      armedRobbery: { min: "0", max: "Life", paroleEligible: "Determinate", notes: "Class A crime" },
      drugTrafficking: { min: "0", max: "10 yrs", paroleEligible: "Determinate", notes: "Class B crime" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Determinate", notes: "Class C crime" },
      burglary: { min: "0", max: "Life", paroleEligible: "Determinate", notes: "Class A crime (burglary of dwelling)" },
      aggAssault: { min: "0", max: "10 yrs", paroleEligible: "Determinate", notes: "Class B crime" },
      sexualAssault: { min: "0", max: "Life", paroleEligible: "Determinate", notes: "Registration required" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Determinate", notes: "$1,500+ threshold" },
    },
  },
  Maryland: {
    paroleBoard: "Maryland Parole Commission",
    paroleUrl: "https://www.dpscs.state.md.us/agencies/mpc.shtml",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "After 15 yrs (board review)", notes: "Death penalty abolished in 2013" },
      murder2: { min: "0", max: "30 yrs", paroleEligible: "Board review after 25% served", notes: "Judge discretion" },
      armedRobbery: { min: "0", max: "20 yrs", paroleEligible: "After minimum", notes: "Mandatory minimum if firearm used" },
      drugTrafficking: { min: "0", max: "25 yrs", paroleEligible: "After minimum", notes: "Enhanced if near school" },
      drugPossession: { min: "0", max: "4 yrs", paroleEligible: "Eligible", notes: "Felony possession" },
      burglary: { min: "0", max: "20 yrs", paroleEligible: "Eligible", notes: "1st degree" },
      aggAssault: { min: "0", max: "25 yrs", paroleEligible: "Eligible", notes: "1st degree assault" },
      sexualAssault: { min: "0", max: "Life", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "$1,500+ threshold" },
    },
  },
  Massachusetts: {
    paroleBoard: "Massachusetts Parole Board",
    paroleUrl: "https://www.mass.gov/orgs/parole-board",
    offenses: {
      murder1: { min: "Life", max: "Life", paroleEligible: "Board review after 15 yrs", notes: "No death penalty in MA" },
      murder2: { min: "Life", max: "Life", paroleEligible: "Board review after 15 yrs", notes: "Parole possible" },
      armedRobbery: { min: "0", max: "Life", paroleEligible: "Board review", notes: "Minimum 5 yrs if armed" },
      drugTrafficking: { min: "3.5 yrs", max: "15 yrs", paroleEligible: "After mandatory minimum", notes: "Mandatory minimum based on quantity" },
      drugPossession: { min: "0", max: "2 yrs", paroleEligible: "Eligible", notes: "Class D/E substance" },
      burglary: { min: "0", max: "20 yrs", paroleEligible: "Board review", notes: "Nighttime armed burglary" },
      aggAssault: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Simple assault & battery" },
      sexualAssault: { min: "0", max: "Life", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "$1,200+ threshold" },
    },
  },
  Michigan: {
    paroleBoard: "Michigan Parole Board",
    paroleUrl: "https://www.michigan.gov/corrections/0,4551,7-119-1441---,00.html",
    offenses: {
      murder1: { min: "Life", max: "Life", paroleEligible: "No parole for 1st degree murder", notes: "Mandatory LWOP" },
      murder2: { min: "Life", max: "Life", paroleEligible: "Board review after minimum", notes: "Indeterminate; board sets minimum" },
      armedRobbery: { min: "Life", max: "Life", paroleEligible: "Board review after minimum", notes: "Indeterminate sentence" },
      drugTrafficking: { min: "1 yr", max: "Life", paroleEligible: "After mandatory minimum", notes: "Based on quantity" },
      drugPossession: { min: "0", max: "4 yrs", paroleEligible: "Eligible", notes: "Class G felony" },
      burglary: { min: "0", max: "Life", paroleEligible: "Board review", notes: "Home invasion 1st degree" },
      aggAssault: { min: "0", max: "4 yrs", paroleEligible: "Eligible", notes: "Class G felony" },
      sexualAssault: { min: "Life", max: "Life", paroleEligible: "Board review after minimum", notes: "Registration required; indeterminate" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "$20,000+ for top tier" },
    },
  },
  Minnesota: {
    paroleBoard: "Minnesota Department of Corrections (supervised release)",
    paroleUrl: "https://mn.gov/doc",
    offenses: {
      murder1: { min: "30 yrs", max: "Life", paroleEligible: "Board review after 30 yrs", notes: "Determinate-plus-supervised release" },
      murder2: { min: "12.5 yrs", max: "Life", paroleEligible: "After mandatory minimum", notes: "Guideline sentence" },
      armedRobbery: { min: "4.5 yrs", max: "20 yrs", paroleEligible: "After 2/3 served; supervised release", notes: "Sentencing guidelines" },
      drugTrafficking: { min: "4.5 yrs", max: "15 yrs", paroleEligible: "After 2/3 served", notes: "Based on quantity" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "After 2/3 served", notes: "5th degree to 1st degree" },
      burglary: { min: "0", max: "20 yrs", paroleEligible: "After 2/3 served", notes: "1st degree" },
      aggAssault: { min: "0", max: "10 yrs", paroleEligible: "After 2/3 served", notes: "2nd degree" },
      sexualAssault: { min: "0", max: "25 yrs", paroleEligible: "After 2/3 served", notes: "Registration required" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "After 2/3 served", notes: "$5,000+ threshold" },
    },
  },
  Mississippi: {
    paroleBoard: "Mississippi Parole Board",
    paroleUrl: "https://www.prc.ms.gov",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "No parole for capital murder", notes: "Death penalty state" },
      murder2: { min: "20 yrs", max: "Life", paroleEligible: "After 25% served", notes: "Class A felony" },
      armedRobbery: { min: "3 yrs", max: "Life", paroleEligible: "After 25% served", notes: "Mandatory 3 yr minimum" },
      drugTrafficking: { min: "5 yrs", max: "Life", paroleEligible: "After 25% served", notes: "Mandatory minimum by quantity" },
      drugPossession: { min: "0", max: "8 yrs", paroleEligible: "After 25% served", notes: "Felony possession" },
      burglary: { min: "3 yrs", max: "25 yrs", paroleEligible: "After 25% served", notes: "1st degree" },
      aggAssault: { min: "2 yrs", max: "20 yrs", paroleEligible: "After 25% served", notes: "Class D felony" },
      sexualAssault: { min: "5 yrs", max: "Life", paroleEligible: "After minimum", notes: "Registration required" },
      grandTheft: { min: "1 yr", max: "10 yrs", paroleEligible: "After 25% served", notes: "$1,000+ threshold" },
    },
  },
  Missouri: {
    paroleBoard: "Missouri Board of Probation and Parole",
    paroleUrl: "https://doc.mo.gov/divisions/probation-parole",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "After 30 yrs (board review)", notes: "Death penalty state" },
      murder2: { min: "10 yrs", max: "30 yrs", paroleEligible: "Board review", notes: "Class A felony" },
      armedRobbery: { min: "5 yrs", max: "15 yrs", paroleEligible: "Board review", notes: "Class B felony" },
      drugTrafficking: { min: "5 yrs", max: "15 yrs", paroleEligible: "Board review", notes: "Class B felony" },
      drugPossession: { min: "0", max: "7 yrs", paroleEligible: "Eligible", notes: "Class D felony" },
      burglary: { min: "5 yrs", max: "15 yrs", paroleEligible: "Board review", notes: "Class B felony (1st degree)" },
      aggAssault: { min: "0", max: "7 yrs", paroleEligible: "Eligible", notes: "Class C felony" },
      sexualAssault: { min: "5 yrs", max: "Life", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "7 yrs", paroleEligible: "Eligible", notes: "$750+ threshold" },
    },
  },
  Montana: {
    paroleBoard: "Montana Board of Pardons and Parole",
    paroleUrl: "https://bopp.mt.gov",
    offenses: {
      murder1: { min: "Life", max: "Death / Life", paroleEligible: "Board review after minimum", notes: "Death penalty state" },
      murder2: { min: "10 yrs", max: "100 yrs", paroleEligible: "Board review", notes: "" },
      armedRobbery: { min: "2 yrs", max: "40 yrs", paroleEligible: "Board review", notes: "Robbery with weapon" },
      drugTrafficking: { min: "1 yr", max: "20 yrs", paroleEligible: "Board review", notes: "Felony distribution" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Class C felony" },
      burglary: { min: "1 yr", max: "20 yrs", paroleEligible: "Board review", notes: "Felony burglary" },
      aggAssault: { min: "1 yr", max: "20 yrs", paroleEligible: "Board review", notes: "Felony assault" },
      sexualAssault: { min: "2 yrs", max: "Life", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "$1,500+ threshold" },
    },
  },
  Nebraska: {
    paroleBoard: "Nebraska Board of Parole",
    paroleUrl: "https://www.supremecourt.ne.gov/boards/board-parole",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Board review after minimum", notes: "Death penalty available" },
      murder2: { min: "20 yrs", max: "Life", paroleEligible: "Board review after 20 yrs", notes: "Class IA felony" },
      armedRobbery: { min: "3 yrs", max: "50 yrs", paroleEligible: "Board review", notes: "Class II felony" },
      drugTrafficking: { min: "1 yr", max: "50 yrs", paroleEligible: "Board review", notes: "Class IB-II felony" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Class IV felony" },
      burglary: { min: "1 yr", max: "20 yrs", paroleEligible: "Board review", notes: "Class III felony" },
      aggAssault: { min: "1 yr", max: "20 yrs", paroleEligible: "Board review", notes: "Class III felony" },
      sexualAssault: { min: "1 yr", max: "50 yrs", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "2 yrs", paroleEligible: "Eligible", notes: "$1,500+ threshold" },
    },
  },
  Nevada: {
    paroleBoard: "Nevada Board of Parole Commissioners",
    paroleUrl: "https://parole.nv.gov",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "After 20 yrs (if eligible)", notes: "Death penalty state" },
      murder2: { min: "25 yrs", max: "Life", paroleEligible: "After 25 yrs; board review", notes: "Category A felony" },
      armedRobbery: { min: "2 yrs", max: "15 yrs", paroleEligible: "Board review", notes: "Category B felony" },
      drugTrafficking: { min: "1 yr", max: "Life", paroleEligible: "After mandatory minimum", notes: "Mandatory minimums by quantity" },
      drugPossession: { min: "1 yr", max: "4 yrs", paroleEligible: "Board review", notes: "Category E felony" },
      burglary: { min: "1 yr", max: "10 yrs", paroleEligible: "Board review", notes: "Category B felony" },
      aggAssault: { min: "1 yr", max: "6 yrs", paroleEligible: "Board review", notes: "Category B felony" },
      sexualAssault: { min: "Life", max: "Life", paroleEligible: "Board review after 10 yrs", notes: "Registration required" },
      grandTheft: { min: "1 yr", max: "4 yrs", paroleEligible: "Board review", notes: "$1,200+ threshold" },
    },
  },
  "New Hampshire": {
    paroleBoard: "New Hampshire Adult Parole Board",
    paroleUrl: "https://www.nh.gov/nhdoc/divisions/field/parole.html",
    offenses: {
      murder1: { min: "Life", max: "Life", paroleEligible: "Board review after minimum", notes: "No death penalty in NH" },
      murder2: { min: "15 yrs", max: "Life", paroleEligible: "After minimum", notes: "Class A felony" },
      armedRobbery: { min: "0", max: "15 yrs", paroleEligible: "After minimum", notes: "Class A felony" },
      drugTrafficking: { min: "0", max: "20 yrs", paroleEligible: "After minimum", notes: "Enhanced penalties" },
      drugPossession: { min: "0", max: "7 yrs", paroleEligible: "Eligible", notes: "Class B felony" },
      burglary: { min: "0", max: "15 yrs", paroleEligible: "After minimum", notes: "Class A felony" },
      aggAssault: { min: "0", max: "7 yrs", paroleEligible: "Eligible", notes: "Class B felony" },
      sexualAssault: { min: "10 yrs", max: "Life", paroleEligible: "After minimum", notes: "Registration required" },
      grandTheft: { min: "0", max: "7 yrs", paroleEligible: "Eligible", notes: "$1,500+ threshold" },
    },
  },
  "New Jersey": {
    paroleBoard: "New Jersey State Parole Board",
    paroleUrl: "https://www.nj.gov/parole",
    offenses: {
      murder1: { min: "30 yrs", max: "Life", paroleEligible: "After 30 yrs; board review", notes: "No death penalty since 2007" },
      murder2: { min: "30 yrs", max: "Life", paroleEligible: "Board review after minimum", notes: "1st degree crime" },
      armedRobbery: { min: "5 yrs", max: "20 yrs", paroleEligible: "After 85% served (NERA)", notes: "No Early Release Act (85% rule)" },
      drugTrafficking: { min: "3 yrs", max: "20 yrs", paroleEligible: "After mandatory minimum", notes: "Mandatory minimums in drug-free zones" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "3rd degree crime" },
      burglary: { min: "3 yrs", max: "10 yrs", paroleEligible: "After 85% (NERA if violent)", notes: "2nd degree crime" },
      aggAssault: { min: "5 yrs", max: "10 yrs", paroleEligible: "After 85% (NERA)", notes: "2nd degree crime" },
      sexualAssault: { min: "5 yrs", max: "10 yrs", paroleEligible: "After 85% (NERA)", notes: "Registration required (Megan's Law)" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "$75,000+ threshold for 2nd degree" },
    },
  },
  "New Mexico": {
    paroleBoard: "New Mexico Parole Board",
    paroleUrl: "https://cd.nm.gov/parole-board",
    offenses: {
      murder1: { min: "Life", max: "Life", paroleEligible: "Board review after minimum", notes: "No death penalty since 2009" },
      murder2: { min: "15 yrs", max: "Life", paroleEligible: "After 15 yrs", notes: "1st degree felony" },
      armedRobbery: { min: "3 yrs", max: "18 yrs", paroleEligible: "After 1/3 served", notes: "2nd degree felony" },
      drugTrafficking: { min: "3 yrs", max: "18 yrs", paroleEligible: "After 1/3 served", notes: "2nd degree felony" },
      drugPossession: { min: "0", max: "18 mos", paroleEligible: "Eligible", notes: "4th degree felony" },
      burglary: { min: "0", max: "9 yrs", paroleEligible: "After 1/3 served", notes: "3rd degree felony" },
      aggAssault: { min: "0", max: "3 yrs", paroleEligible: "Eligible", notes: "4th degree felony" },
      sexualAssault: { min: "9 yrs", max: "18 yrs", paroleEligible: "After 1/3 served", notes: "Registration required" },
      grandTheft: { min: "0", max: "18 mos", paroleEligible: "Eligible", notes: "$2,500+ threshold" },
    },
  },
  "New York": {
    paroleBoard: "New York State Board of Parole",
    paroleUrl: "https://doccs.ny.gov/board-parole",
    offenses: {
      murder1: { min: "20 yrs", max: "Life", paroleEligible: "Board review after 20 yrs", notes: "No death penalty since 2007" },
      murder2: { min: "15 yrs", max: "Life", paroleEligible: "Board review after 15 yrs", notes: "Class A-I felony" },
      armedRobbery: { min: "8 yrs", max: "Life", paroleEligible: "Board review after 8 yrs", notes: "Class B violent felony" },
      drugTrafficking: { min: "8 yrs", max: "Life", paroleEligible: "Board review after 8 yrs", notes: "Class A-I felony" },
      drugPossession: { min: "1 yr", max: "2.5 yrs", paroleEligible: "After minimum", notes: "Class E felony (3rd degree possession)" },
      burglary: { min: "3.5 yrs", max: "15 yrs", paroleEligible: "After minimum", notes: "Class C violent felony (1st degree)" },
      aggAssault: { min: "3 yrs", max: "7 yrs", paroleEligible: "After minimum", notes: "Class D violent felony" },
      sexualAssault: { min: "3.5 yrs", max: "Life", paroleEligible: "Board review", notes: "Registration required (SORA)" },
      grandTheft: { min: "1.5 yrs", max: "4 yrs", paroleEligible: "After minimum", notes: "$3,000+ threshold for Class E" },
    },
  },
  "North Carolina": {
    paroleBoard: "North Carolina Post-Release Supervision and Parole Commission",
    paroleUrl: "https://www.dac.nc.gov/divisions/post-release",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "No parole for 1st degree murder", notes: "Death penalty state; structured sentencing" },
      murder2: { min: "12 yrs 3 mos", max: "Life", paroleEligible: "After minimum (determinate)", notes: "Class B1 felony" },
      armedRobbery: { min: "4 yrs 8 mos", max: "Life", paroleEligible: "After minimum (determinate)", notes: "Class D felony" },
      drugTrafficking: { min: "35 mos", max: "Life", paroleEligible: "After minimum (mandatory)", notes: "Mandatory minimums by quantity" },
      drugPossession: { min: "6 mos", max: "39 mos", paroleEligible: "After minimum", notes: "Class I/H felony" },
      burglary: { min: "11 mos 15 days", max: "25 yrs 11 mos", paroleEligible: "After minimum (determinate)", notes: "1st degree Class D; structured sentencing" },
      aggAssault: { min: "15 mos", max: "25 yrs", paroleEligible: "After minimum", notes: "Class E felony" },
      sexualAssault: { min: "6 yrs 4 mos", max: "Life", paroleEligible: "After minimum", notes: "Registration required" },
      grandTheft: { min: "3 mos 26 days", max: "8 yrs 8 mos", paroleEligible: "After minimum", notes: "$1,000+ threshold" },
    },
  },
  "North Dakota": {
    paroleBoard: "North Dakota Parole Board",
    paroleUrl: "https://www.docr.nd.gov/parole-and-pardon-board",
    offenses: {
      murder1: { min: "10 yrs", max: "Life", paroleEligible: "Board review after 10 yrs", notes: "Class AA felony" },
      murder2: { min: "10 yrs", max: "Life", paroleEligible: "Board review after 10 yrs", notes: "Class A felony" },
      armedRobbery: { min: "0", max: "20 yrs", paroleEligible: "Board review", notes: "Class B felony" },
      drugTrafficking: { min: "0", max: "20 yrs", paroleEligible: "Board review", notes: "Class B felony" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Class C felony" },
      burglary: { min: "0", max: "10 yrs", paroleEligible: "Board review", notes: "Class B felony" },
      aggAssault: { min: "0", max: "10 yrs", paroleEligible: "Board review", notes: "Class B felony" },
      sexualAssault: { min: "0", max: "20 yrs", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "$10,000+ threshold" },
    },
  },
  Ohio: {
    paroleBoard: "Ohio Parole Board",
    paroleUrl: "https://drc.ohio.gov/about/parole-board",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Board review after 20-25 yrs", notes: "Death penalty state" },
      murder2: { min: "15 yrs", max: "Life", paroleEligible: "Board review after 15 yrs", notes: "Unclassified felony" },
      armedRobbery: { min: "3 yrs", max: "11 yrs", paroleEligible: "Board review after mandatory", notes: "Mandatory firearm term" },
      drugTrafficking: { min: "11 mos", max: "11 yrs", paroleEligible: "Board review", notes: "F1 to F5 depending on quantity" },
      drugPossession: { min: "0", max: "6 mos", paroleEligible: "Eligible", notes: "F5 felony (small amount)" },
      burglary: { min: "1 yr", max: "8 yrs", paroleEligible: "Board review", notes: "F2 felony" },
      aggAssault: { min: "0", max: "18 mos", paroleEligible: "Eligible", notes: "F4 felony" },
      sexualAssault: { min: "3 yrs", max: "11 yrs", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "18 mos", paroleEligible: "Eligible", notes: "$7,500-$150,000 threshold for F4" },
    },
  },
  Oklahoma: {
    paroleBoard: "Oklahoma Pardon and Parole Board",
    paroleUrl: "https://ppb.ok.gov",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Board review after 85% served", notes: "Death penalty state" },
      murder2: { min: "10 yrs", max: "Life", paroleEligible: "Board review", notes: "85% rule applies" },
      armedRobbery: { min: "5 yrs", max: "Life", paroleEligible: "After 85% served", notes: "Mandatory minimum" },
      drugTrafficking: { min: "4 yrs", max: "Life", paroleEligible: "After 85% (no deferred sentence)", notes: "Mandatory minimums" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "SQ 781 reform" },
      burglary: { min: "7 yrs", max: "20 yrs", paroleEligible: "Board review", notes: "1st degree — mandatory 7 yrs" },
      aggAssault: { min: "0", max: "10 yrs", paroleEligible: "Board review", notes: "Felony assault and battery" },
      sexualAssault: { min: "1 yr", max: "Life", paroleEligible: "Board review after 85%", notes: "Registration required" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "$1,000+ threshold" },
    },
  },
  Oregon: {
    paroleBoard: "Oregon Board of Parole and Post-Prison Supervision",
    paroleUrl: "https://www.oregon.gov/bpp",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Board review after minimum", notes: "Death penalty state" },
      murder2: { min: "25 yrs", max: "Life", paroleEligible: "After 25 yrs; board review", notes: "Ballot Measure 11 — mandatory minimums" },
      armedRobbery: { min: "7 yrs 6 mos", max: "Life", paroleEligible: "After 90 mos (Measure 11)", notes: "No good time on Measure 11 crimes" },
      drugTrafficking: { min: "0", max: "10 yrs", paroleEligible: "Board review", notes: "Measure 110 decriminalized personal use" },
      drugPossession: { min: "0", max: "1 yr", paroleEligible: "Eligible", notes: "Recriminalized in 2024" },
      burglary: { min: "0", max: "20 yrs", paroleEligible: "Board review", notes: "1st degree (residential) Measure 11" },
      aggAssault: { min: "5 yrs", max: "Life", paroleEligible: "After minimum (Measure 11)", notes: "Measure 11 mandatory minimums" },
      sexualAssault: { min: "8 yrs 4 mos", max: "Life", paroleEligible: "After minimum (Measure 11)", notes: "Registration required" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Board review", notes: "$1,000+ threshold" },
    },
  },
  Pennsylvania: {
    paroleBoard: "Pennsylvania Board of Probation and Parole",
    paroleUrl: "https://www.pbpp.pa.gov",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "No parole for 1st degree murder", notes: "Mandatory LWOP; death penalty state" },
      murder2: { min: "Life", max: "Life", paroleEligible: "Board review after minimum (if juvenile)", notes: "Mandatory life for adults" },
      armedRobbery: { min: "5 yrs", max: "20 yrs", paroleEligible: "Board review", notes: "F1 robbery" },
      drugTrafficking: { min: "0", max: "10 yrs", paroleEligible: "Board review", notes: "F2 felony typically" },
      drugPossession: { min: "0", max: "1 yr", paroleEligible: "Eligible", notes: "M1 misdemeanor or F3" },
      burglary: { min: "0", max: "20 yrs", paroleEligible: "Board review", notes: "F1 burglary (overnight shelter)" },
      aggAssault: { min: "0", max: "20 yrs", paroleEligible: "Board review", notes: "F1 felony (serious bodily injury)" },
      sexualAssault: { min: "0", max: "20 yrs", paroleEligible: "Board review", notes: "Registration required (Megan's Law)" },
      grandTheft: { min: "0", max: "7 yrs", paroleEligible: "Eligible", notes: "$2,000+ threshold for F3" },
    },
  },
  "Rhode Island": {
    paroleBoard: "Rhode Island Parole Board",
    paroleUrl: "https://www.doc.ri.gov/community/parole-board.php",
    offenses: {
      murder1: { min: "Life", max: "Life", paroleEligible: "Board review after minimum", notes: "No death penalty since 1984" },
      murder2: { min: "10 yrs", max: "Life", paroleEligible: "After minimum", notes: "Class A felony" },
      armedRobbery: { min: "10 yrs", max: "Life", paroleEligible: "After minimum", notes: "Class A felony" },
      drugTrafficking: { min: "10 yrs", max: "Life", paroleEligible: "After minimum", notes: "Enhanced penalties" },
      drugPossession: { min: "0", max: "3 yrs", paroleEligible: "Eligible", notes: "Class D felony" },
      burglary: { min: "0", max: "Life", paroleEligible: "Board review", notes: "Felony burglary" },
      aggAssault: { min: "0", max: "20 yrs", paroleEligible: "Board review", notes: "1st degree assault" },
      sexualAssault: { min: "10 yrs", max: "Life", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "$1,500+ threshold" },
    },
  },
  "South Carolina": {
    paroleBoard: "South Carolina Department of Probation, Parole and Pardon Services",
    paroleUrl: "https://www.dppps.sc.gov",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "No parole for murder", notes: "Death penalty state" },
      murder2: { min: "Life", max: "Life", paroleEligible: "Board review after minimum", notes: "Mandatory LWOP" },
      armedRobbery: { min: "10 yrs", max: "30 yrs", paroleEligible: "After minimum", notes: "No parole for armed robbery" },
      drugTrafficking: { min: "7 yrs", max: "Life", paroleEligible: "After 85% served", notes: "Mandatory minimum" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Class E felony" },
      burglary: { min: "15 yrs", max: "Life", paroleEligible: "Board review after minimum", notes: "1st degree — mandatory 15 yrs" },
      aggAssault: { min: "0", max: "20 yrs", paroleEligible: "Eligible", notes: "Class C felony" },
      sexualAssault: { min: "25 yrs", max: "Life", paroleEligible: "Board review after 25 yrs", notes: "Registration required" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "$2,000+ threshold" },
    },
  },
  "South Dakota": {
    paroleBoard: "South Dakota Board of Pardons and Paroles",
    paroleUrl: "https://doc.sd.gov/adult/pardons",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Board review after minimum", notes: "Death penalty state" },
      murder2: { min: "10 yrs", max: "Life", paroleEligible: "Board review after minimum", notes: "Class B felony" },
      armedRobbery: { min: "0", max: "25 yrs", paroleEligible: "Board review", notes: "Class 2 felony" },
      drugTrafficking: { min: "0", max: "Life", paroleEligible: "Board review", notes: "Class 1 felony possible" },
      drugPossession: { min: "0", max: "2 yrs", paroleEligible: "Eligible", notes: "Class 6 felony" },
      burglary: { min: "0", max: "15 yrs", paroleEligible: "Board review", notes: "Class 3 felony" },
      aggAssault: { min: "0", max: "15 yrs", paroleEligible: "Board review", notes: "Class 3 felony" },
      sexualAssault: { min: "0", max: "50 yrs", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "$5,000+ threshold" },
    },
  },
  Tennessee: {
    paroleBoard: "Tennessee Board of Parole",
    paroleUrl: "https://www.tn.gov/bop.html",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Board review after 51 yrs (life)", notes: "Death penalty state" },
      murder2: { min: "15 yrs", max: "60 yrs", paroleEligible: "Board review after 30% served", notes: "Class A felony" },
      armedRobbery: { min: "8 yrs", max: "30 yrs", paroleEligible: "Board review after 30% served", notes: "Class B felony" },
      drugTrafficking: { min: "8 yrs", max: "30 yrs", paroleEligible: "Board review after 30% served", notes: "Class B felony" },
      drugPossession: { min: "1 yr", max: "6 yrs", paroleEligible: "Board review", notes: "Class E/D felony" },
      burglary: { min: "3 yrs", max: "15 yrs", paroleEligible: "Board review after 30%", notes: "Class C felony (1st degree)" },
      aggAssault: { min: "3 yrs", max: "15 yrs", paroleEligible: "Board review after 30%", notes: "Class C felony" },
      sexualAssault: { min: "15 yrs", max: "60 yrs", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "1 yr", max: "6 yrs", paroleEligible: "Board review", notes: "$2,500+ threshold" },
    },
  },
  Texas: {
    paroleBoard: "Texas Board of Pardons and Paroles",
    paroleUrl: "https://www.tdcj.texas.gov/bpp",
    offenses: {
      murder1: { min: "5 yrs", max: "Life / Death", paroleEligible: "After 1/4 of sentence served", notes: "Capital murder carries life or death" },
      murder2: { min: "2 yrs", max: "20 yrs", paroleEligible: "After 1/4 served", notes: "2nd degree felony" },
      armedRobbery: { min: "5 yrs", max: "99 yrs / Life", paroleEligible: "After 1/4 served", notes: "1st degree felony" },
      drugTrafficking: { min: "5 yrs", max: "99 yrs / Life", paroleEligible: "After 1/4 served", notes: "1st degree felony" },
      drugPossession: { min: "180 days", max: "2 yrs", paroleEligible: "After 1/4 served", notes: "State jail felony" },
      burglary: { min: "2 yrs", max: "20 yrs", paroleEligible: "After 1/4 served", notes: "2nd degree felony" },
      aggAssault: { min: "2 yrs", max: "20 yrs", paroleEligible: "After 1/4 served", notes: "2nd degree felony" },
      sexualAssault: { min: "2 yrs", max: "20 yrs", paroleEligible: "After 1/4 served", notes: "Registration required; 2nd degree felony" },
      grandTheft: { min: "180 days", max: "2 yrs", paroleEligible: "After 1/4 served", notes: "State jail felony ($2,500-$30,000)" },
    },
  },
  Utah: {
    paroleBoard: "Utah Board of Pardons and Parole",
    paroleUrl: "https://bop.utah.gov",
    offenses: {
      murder1: { min: "Life", max: "Death / Life", paroleEligible: "Board review; indeterminate", notes: "Death penalty state" },
      murder2: { min: "Life", max: "Life", paroleEligible: "Board review after minimum", notes: "1st degree felony; indeterminate" },
      armedRobbery: { min: "Life", max: "Life", paroleEligible: "Board sets release date", notes: "1st degree felony; board decides" },
      drugTrafficking: { min: "Life", max: "Life", paroleEligible: "Board decides release", notes: "1st degree felony" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Board decides", notes: "3rd degree felony" },
      burglary: { min: "Life", max: "Life", paroleEligible: "Board decides release", notes: "1st degree felony (if person present)" },
      aggAssault: { min: "0", max: "5 yrs", paroleEligible: "Board decides", notes: "3rd degree felony" },
      sexualAssault: { min: "Life", max: "Life", paroleEligible: "Board decides release", notes: "Registration required; indeterminate" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Board decides", notes: "$1,500+ threshold" },
    },
  },
  Vermont: {
    paroleBoard: "Vermont Parole Board",
    paroleUrl: "https://doc.vermont.gov/parole-board",
    offenses: {
      murder1: { min: "Life", max: "Life", paroleEligible: "Board review after minimum", notes: "No death penalty since 1972" },
      murder2: { min: "20 yrs", max: "Life", paroleEligible: "After minimum", notes: "Felony murder" },
      armedRobbery: { min: "0", max: "25 yrs", paroleEligible: "Board review", notes: "Aggravated robbery" },
      drugTrafficking: { min: "0", max: "30 yrs", paroleEligible: "Board review", notes: "Enhanced penalties" },
      drugPossession: { min: "0", max: "3 yrs", paroleEligible: "Eligible", notes: "Felony possession" },
      burglary: { min: "0", max: "25 yrs", paroleEligible: "Board review", notes: "Burglary (inhabited building)" },
      aggAssault: { min: "0", max: "15 yrs", paroleEligible: "Board review", notes: "Aggravated assault" },
      sexualAssault: { min: "1 yr", max: "Life", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "Eligible", notes: "$900+ threshold" },
    },
  },
  Virginia: {
    paroleBoard: "Virginia Parole Board",
    paroleUrl: "https://vpb.virginia.gov",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "No parole for post-1995 offenses", notes: "Abolition of parole in 1995; death penalty available" },
      murder2: { min: "5 yrs", max: "40 yrs", paroleEligible: "No parole (post-1995)", notes: "Must serve 85% (TIS)" },
      armedRobbery: { min: "5 yrs", max: "Life", paroleEligible: "No parole (post-1995)", notes: "Must serve 85% (TIS)" },
      drugTrafficking: { min: "5 yrs", max: "40 yrs", paroleEligible: "No parole (post-1995)", notes: "85% rule applies" },
      drugPossession: { min: "1 yr", max: "10 yrs", paroleEligible: "No parole", notes: "Class 5 felony" },
      burglary: { min: "1 yr", max: "20 yrs", paroleEligible: "No parole (post-1995)", notes: "Statutory burglary" },
      aggAssault: { min: "1 yr", max: "5 yrs", paroleEligible: "No parole (post-1995)", notes: "Class 6 felony" },
      sexualAssault: { min: "5 yrs", max: "Life", paroleEligible: "No parole (post-1995)", notes: "Registration required" },
      grandTheft: { min: "1 yr", max: "20 yrs", paroleEligible: "No parole (post-1995)", notes: "$1,000+ threshold" },
    },
  },
  Washington: {
    paroleBoard: "Washington Indeterminate Sentence Review Board",
    paroleUrl: "https://isrb.wa.gov",
    offenses: {
      murder1: { min: "20 yrs", max: "Life", paroleEligible: "Board review after minimum", notes: "No death penalty since 2023; SRA applies" },
      murder2: { min: "13.5 yrs", max: "Life", paroleEligible: "After SRA term; board for indeterminate", notes: "Sentencing Reform Act (SRA)" },
      armedRobbery: { min: "3 yrs 2 mos", max: "9 yrs 2 mos", paroleEligible: "Determinate — serve full term", notes: "SRA standard range" },
      drugTrafficking: { min: "2 yrs 3 mos", max: "10 yrs", paroleEligible: "Determinate — serve full term", notes: "SRA standard range" },
      drugPossession: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "Class C felony" },
      burglary: { min: "13 mos", max: "17 mos", paroleEligible: "Determinate", notes: "SRA standard range — residential 1st degree" },
      aggAssault: { min: "31 mos", max: "41 mos", paroleEligible: "Determinate", notes: "SRA standard range" },
      sexualAssault: { min: "Life", max: "Life", paroleEligible: "ISRB review (indeterminate)", notes: "Registration required; indeterminate sentence" },
      grandTheft: { min: "0", max: "5 yrs", paroleEligible: "Eligible", notes: "$750+ threshold" },
    },
  },
  "West Virginia": {
    paroleBoard: "West Virginia Board of Parole",
    paroleUrl: "https://dcr.wv.gov/Pages/parole-board.aspx",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Board review after minimum", notes: "Death penalty available" },
      murder2: { min: "10 yrs", max: "40 yrs", paroleEligible: "Board review after 10 yrs", notes: "Felony" },
      armedRobbery: { min: "10 yrs", max: "Life", paroleEligible: "Board review", notes: "Robbery with deadly weapon" },
      drugTrafficking: { min: "1 yr", max: "15 yrs", paroleEligible: "Board review", notes: "Felony delivery" },
      drugPossession: { min: "0", max: "6 mos", paroleEligible: "Eligible", notes: "Misdemeanor to felony" },
      burglary: { min: "1 yr", max: "15 yrs", paroleEligible: "Board review", notes: "Felony burglary" },
      aggAssault: { min: "1 yr", max: "5 yrs", paroleEligible: "Board review", notes: "Felony assault" },
      sexualAssault: { min: "15 yrs", max: "35 yrs", paroleEligible: "Board review after minimum", notes: "Registration required" },
      grandTheft: { min: "1 yr", max: "10 yrs", paroleEligible: "Board review", notes: "$2,500+ threshold" },
    },
  },
  Wisconsin: {
    paroleBoard: "Wisconsin Parole Commission",
    paroleUrl: "https://doc.wi.gov/Pages/AboutDOC/ParoleCommission.aspx",
    offenses: {
      murder1: { min: "Life", max: "Life", paroleEligible: "Board review (discretionary)", notes: "No death penalty; discretionary life" },
      murder2: { min: "Life", max: "Life", paroleEligible: "Board review", notes: "Class A felony" },
      armedRobbery: { min: "0", max: "40 yrs", paroleEligible: "After 25% served", notes: "Class B felony (if armed)" },
      drugTrafficking: { min: "0", max: "40 yrs", paroleEligible: "After 25% served", notes: "Class B felony" },
      drugPossession: { min: "0", max: "6 yrs", paroleEligible: "After 25% served", notes: "Class H felony" },
      burglary: { min: "0", max: "40 yrs", paroleEligible: "After 25% served", notes: "Class B felony (1st degree)" },
      aggAssault: { min: "0", max: "6 yrs", paroleEligible: "After 25% served", notes: "Class H/I felony" },
      sexualAssault: { min: "0", max: "40 yrs", paroleEligible: "After 25% served", notes: "Registration required" },
      grandTheft: { min: "0", max: "6 yrs", paroleEligible: "After 25% served", notes: "$2,500+ threshold" },
    },
  },
  Wyoming: {
    paroleBoard: "Wyoming Board of Parole",
    paroleUrl: "https://corrections.wyo.gov/home/wyoming-board-of-parole",
    offenses: {
      murder1: { min: "Life", max: "Life / Death", paroleEligible: "Board review after minimum", notes: "Death penalty state" },
      murder2: { min: "20 yrs", max: "Life", paroleEligible: "Board review after 20 yrs", notes: "Felony" },
      armedRobbery: { min: "5 yrs", max: "Life", paroleEligible: "Board review", notes: "Felony" },
      drugTrafficking: { min: "0", max: "Life", paroleEligible: "Board review", notes: "Felony" },
      drugPossession: { min: "0", max: "7 yrs", paroleEligible: "Board review", notes: "Felony" },
      burglary: { min: "0", max: "10 yrs", paroleEligible: "Board review", notes: "Felony" },
      aggAssault: { min: "0", max: "10 yrs", paroleEligible: "Board review", notes: "Felony" },
      sexualAssault: { min: "5 yrs", max: "Life", paroleEligible: "Board review", notes: "Registration required" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "Board review", notes: "$1,000+ threshold" },
    },
  },
  "Washington D.C.": {
    paroleBoard: "U.S. Parole Commission (handles DC cases)",
    paroleUrl: "https://www.justice.gov/uspc",
    offenses: {
      murder1: { min: "Life", max: "Life", paroleEligible: "Commission review after 20 yrs", notes: "No death penalty in DC" },
      murder2: { min: "20 yrs", max: "Life", paroleEligible: "Commission review", notes: "Controlled by U.S. Parole Commission" },
      armedRobbery: { min: "2 yrs", max: "15 yrs", paroleEligible: "Commission review", notes: "Mandatory 2 yr minimum" },
      drugTrafficking: { min: "0", max: "30 yrs", paroleEligible: "Commission review", notes: "Enhanced penalties near schools" },
      drugPossession: { min: "0", max: "6 mos", paroleEligible: "Eligible", notes: "Misdemeanor; marijuana decriminalized" },
      burglary: { min: "0", max: "15 yrs", paroleEligible: "Commission review", notes: "1st degree" },
      aggAssault: { min: "0", max: "10 yrs", paroleEligible: "Commission review", notes: "Felony assault" },
      sexualAssault: { min: "0", max: "Life", paroleEligible: "Commission review", notes: "Registration required" },
      grandTheft: { min: "0", max: "10 yrs", paroleEligible: "Commission review", notes: "$1,000+ threshold" },
    },
  },
};

const ALL_STATES = Object.keys(STATE_DATA).sort();

export default function SentenceCalculator() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedOffense, setSelectedOffense] = useState<OffenseCategory | "">("");
  const [showResult, setShowResult] = useState(false);

  const result =
    selectedState && selectedOffense && STATE_DATA[selectedState]?.offenses[selectedOffense as OffenseCategory]
      ? STATE_DATA[selectedState].offenses[selectedOffense as OffenseCategory]!
      : null;

  const stateInfo = selectedState ? STATE_DATA[selectedState] : null;

  const handleCalculate = () => {
    if (selectedState && selectedOffense) setShowResult(true);
  };

  const handleReset = () => {
    setShowResult(false);
    setSelectedState("");
    setSelectedOffense("");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-red-700 to-orange-600 px-4 py-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <i className="fas fa-calculator text-lg"></i>
          <h3 className="font-bold text-base">Sentence & Parole Calculator</h3>
        </div>
        <p className="text-red-100 text-xs">
          Look up typical sentence ranges by state. Know the numbers before you or your people step in that courtroom.
        </p>
      </div>

      <div className="p-4 space-y-4">
        {!showResult ? (
          <>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Select Your State
              </label>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setShowResult(false); }}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Pick a state --</option>
                {ALL_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Select the Charge
              </label>
              <select
                value={selectedOffense}
                onChange={(e) => { setSelectedOffense(e.target.value as OffenseCategory); setShowResult(false); }}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Pick a charge --</option>
                {(Object.entries(OFFENSE_LABELS) as [OffenseCategory, string][]).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCalculate}
              disabled={!selectedState || !selectedOffense}
              className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              <i className="fas fa-search mr-2"></i>
              Check the Numbers
            </button>

            <p className="text-xs text-gray-400 text-center">
              This is general information — not legal advice. Always get a real lawyer.
            </p>
          </>
        ) : (
          result && stateInfo ? (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wide">{selectedState}</span>
                <h4 className="font-bold text-gray-900 text-base mt-0.5">{OFFENSE_LABELS[selectedOffense as OffenseCategory]}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                  <div className="text-xs text-orange-600 font-semibold uppercase">Minimum</div>
                  <div className="text-xl font-bold text-orange-700 mt-1">{result.min || "0"}</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                  <div className="text-xs text-red-600 font-semibold uppercase">Maximum</div>
                  <div className="text-xl font-bold text-red-700 mt-1">{result.max}</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="text-xs text-blue-600 font-semibold uppercase mb-1">
                  <i className="fas fa-door-open mr-1"></i>Parole Eligibility
                </div>
                <div className="text-sm font-medium text-blue-800">{result.paroleEligible}</div>
              </div>

              {result.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <div className="text-xs text-yellow-700 font-semibold uppercase mb-1">
                    <i className="fas fa-exclamation-triangle mr-1"></i>Know This
                  </div>
                  <div className="text-xs text-yellow-800">{result.notes}</div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <div className="text-xs text-gray-600 font-semibold uppercase mb-1">
                  <i className="fas fa-gavel mr-1"></i>Parole Board
                </div>
                <div className="text-xs text-gray-700 mb-2">{stateInfo.paroleBoard}</div>
                <a
                  href={stateInfo.paroleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                >
                  <i className="fas fa-external-link-alt text-xs"></i>
                  Visit Parole Board Website
                </a>
              </div>

              <div className="bg-gray-100 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">
                  These are general ranges — judges, priors, and circumstances all affect the real number.
                </p>
                <p className="text-xs font-semibold text-gray-600">Get a lawyer. Period.</p>
              </div>

              <button
                onClick={handleReset}
                className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>Check Another State or Charge
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No data found for that combination.</p>
              <button onClick={handleReset} className="mt-2 text-primary text-sm font-medium">Try again</button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
