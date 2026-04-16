/*
 * Academic License - for use in teaching, academic research, and meeting
 * course requirements at degree granting institutions only.  Not for
 * government, commercial, or other organizational use.
 *
 * File: part4_implement_starter.c
 *
 * Code generated for Simulink model 'part4_implement_starter'.
 *
 * Model version                  : 9.24
 * Simulink Coder version         : 24.2 (R2024b) 21-Jun-2024
 * C/C++ source code generated on : Tue Nov 18 12:29:15 2025
 *
 * Target selection: ert.tlc
 * Embedded hardware selection: Texas Instruments->C2000
 * Code generation objectives: Unspecified
 * Validation result: Not run
 */

#include "part4_implement_starter.h"
#include <math.h>
#include "rtwtypes.h"
#include "part4_implement_starter_private.h"
#include "zero_crossing_types.h"
#include <string.h>

/* Block signals (default storage) */
B_part4_implement_starter_T part4_implement_starter_B;

/* Continuous states */
X_part4_implement_starter_T part4_implement_starter_X;

/* Disabled State Vector */
XDis_part4_implement_starter_T part4_implement_starter_XDis;

/* Block states (default storage) */
DW_part4_implement_starter_T part4_implement_starter_DW;

/* Previous zero-crossings (trigger) states */
PrevZCX_part4_implement_start_T part4_implement_starter_PrevZCX;

/* Real-time model */
static RT_MODEL_part4_implement_star_T part4_implement_starter_M_;
RT_MODEL_part4_implement_star_T *const part4_implement_starter_M =
  &part4_implement_starter_M_;

/*
 * This function updates continuous states using the ODE1 fixed-step
 * solver algorithm
 */
static void rt_ertODEUpdateContinuousStates(RTWSolverInfo *si )
{
  time_T tnew = rtsiGetSolverStopTime(si);
  time_T h = rtsiGetStepSize(si);
  real_T *x = rtsiGetContStates(si);
  ODE1_IntgData *id = (ODE1_IntgData *)rtsiGetSolverData(si);
  real_T *f0 = id->f[0];
  int_T i;
  int_T nXc = 2;
  rtsiSetSimTimeStep(si,MINOR_TIME_STEP);
  rtsiSetdX(si, f0);
  part4_implement_starter_derivatives();
  rtsiSetT(si, tnew);
  for (i = 0; i < nXc; ++i) {
    x[i] += h * f0[i];
  }

  rtsiSetSimTimeStep(si,MAJOR_TIME_STEP);
}

/* Model step function */
void part4_implement_starter_step(void)
{
  real_T rtb_Abs;
  real_T rtb_TF;
  boolean_T tmp;
  ZCEventType zcEvent;
  if (rtmIsMajorTimeStep(part4_implement_starter_M)) {
    /* set solver stop time */
    rtsiSetSolverStopTime(&part4_implement_starter_M->solverInfo,
                          ((part4_implement_starter_M->Timing.clockTick0+1)*
      part4_implement_starter_M->Timing.stepSize0));
  }                                    /* end MajorTimeStep */

  /* Update absolute time of base rate at minor time step */
  if (rtmIsMinorTimeStep(part4_implement_starter_M)) {
    part4_implement_starter_M->Timing.t[0] = rtsiGetT
      (&part4_implement_starter_M->solverInfo);
  }

  /* Reset subsysRan breadcrumbs */
  srClearBC(part4_implement_starter_DW.TriggeredSubsystem_SubsysRanBC);
  tmp = rtmIsMajorTimeStep(part4_implement_starter_M);
  if (tmp) {
    /* S-Function (c280xqep): '<S2>/eQEP' */
    {
      part4_implement_starter_B.eQEP = EQep1Regs.QPOSCNT;/*eQEP Position Counter*/
    }

    /* Gain: '<Root>/phi_p_Gain' incorporates:
     *  DataTypeConversion: '<S2>/Cast To Single'
     */
    part4_implement_starter_B.phi_p_Gain =
      part4_implement_starter_P.phi_p_Gain_Gain * (real_T)
      part4_implement_starter_B.eQEP;

    /* S-Function (c280xqep): '<S2>/eQEP1' */
    {
      part4_implement_starter_B.eQEP1 = EQep2Regs.QPOSCNT;/*eQEP Position Counter*/
    }

    /* Sum: '<Root>/Sum7' incorporates:
     *  DataTypeConversion: '<S2>/Cast To Single1'
     *  Gain: '<Root>/phi_r_Gain'
     */
    part4_implement_starter_B.Sum7 = part4_implement_starter_P.phi_r_Gain_Gain *
      (real_T)part4_implement_starter_B.eQEP1 +
      part4_implement_starter_B.phi_p_Gain;

    /* Sum: '<Root>/Sum1' incorporates:
     *  Constant: '<Root>/Constant'
     */
    part4_implement_starter_B.Sum1 = part4_implement_starter_B.phi_p_Gain +
      part4_implement_starter_P.Constant_Value;

    /* Logic: '<S2>/OR' incorporates:
     *  Constant: '<Root>/Constant7'
     *  Constant: '<Root>/Constant9'
     */
    part4_implement_starter_B.OR = ((part4_implement_starter_P.StartStop___PWM
      != 0.0) || (part4_implement_starter_P.Constant9_Value != 0.0));
  }

  /* TransferFcn: '<Root>/Transfer Fcn' */
  rtb_TF = part4_implement_starter_P.TransferFcn_C *
    part4_implement_starter_X.TransferFcn_CSTATE +
    part4_implement_starter_P.TransferFcn_D * part4_implement_starter_B.Sum7;

  /* Switch: '<S2>/Switch1' incorporates:
   *  Constant: '<S2>/Constant6'
   *  Gain: '<Root>/Gain3'
   *  Saturate: '<Root>/Saturation'
   */
  if (part4_implement_starter_B.OR) {
    rtb_TF = part4_implement_starter_P.Constant6_Value;
  } else {
    /* Abs: '<S1>/Abs' */
    rtb_Abs = fabs(rtb_TF);

    /* Switch: '<S1>/Switch2' incorporates:
     *  Constant: '<S1>/Constant2'
     */
    if (rtb_Abs >= part4_implement_starter_P.Switch2_Threshold) {
      /* Switch: '<S1>/Switch1' incorporates:
       *  Constant: '<S1>/Constant2'
       */
      if (rtb_Abs >= part4_implement_starter_P.Switch1_Threshold) {
        rtb_Abs = rtb_TF;
      } else {
        rtb_Abs = part4_implement_starter_P.Constant2_Value;
      }

      /* End of Switch: '<S1>/Switch1' */

      /* Switch: '<S1>/Switch' incorporates:
       *  Constant: '<S1>/Constant'
       *  Constant: '<S1>/Constant1'
       *  Gain: '<S1>/B1'
       *  Gain: '<S1>/B2'
       *  Sum: '<S1>/Sum1'
       *  Sum: '<S1>/Sum2'
       */
      if (rtb_Abs >= part4_implement_starter_P.Switch_Threshold) {
        rtb_Abs = part4_implement_starter_P.AsymmetricLinearFriction_slope1 *
          rtb_Abs + part4_implement_starter_P.AsymmetricLinearFriction_interc;
      } else {
        rtb_Abs = part4_implement_starter_P.AsymmetricLinearFriction_slope2 *
          rtb_Abs + part4_implement_starter_P.AsymmetricLinearFriction_inte_g;
      }

      /* End of Switch: '<S1>/Switch' */
    } else {
      rtb_Abs = part4_implement_starter_P.Constant2_Value;
    }

    /* End of Switch: '<S1>/Switch2' */

    /* Sum: '<Root>/Sum' incorporates:
     *  Gain: '<Root>/Gain'
     *  SignalConversion generated from: '<Root>/Gain'
     *  TransferFcn: '<Root>/Transfer Fcn1'
     */
    rtb_TF = (((part4_implement_starter_P.TransferFcn1_C *
                part4_implement_starter_X.TransferFcn1_CSTATE +
                part4_implement_starter_P.TransferFcn1_D *
                part4_implement_starter_B.phi_p_Gain) *
               part4_implement_starter_P.Gain_Gain[1] +
               part4_implement_starter_P.Gain_Gain[0] *
               part4_implement_starter_B.Sum1) +
              part4_implement_starter_P.Gain_Gain[2] * rtb_TF) + rtb_Abs;

    /* Saturate: '<Root>/Saturation' */
    if (rtb_TF > part4_implement_starter_P.Saturation_UpperSat) {
      rtb_TF = part4_implement_starter_P.Saturation_UpperSat;
    } else if (rtb_TF < part4_implement_starter_P.Saturation_LowerSat) {
      rtb_TF = part4_implement_starter_P.Saturation_LowerSat;
    }

    rtb_TF *= part4_implement_starter_P.Gain3_Gain;
  }

  /* End of Switch: '<S2>/Switch1' */

  /* Sum: '<S2>/Sum5' incorporates:
   *  Constant: '<S2>/Constant5'
   *  Gain: '<S2>/Gain'
   */
  rtb_TF = part4_implement_starter_P.Gain_Gain_f * rtb_TF +
    part4_implement_starter_P.Constant5_Value;

  /* S-Function (c2802xpwm): '<S2>/ePWM' */
  uint16_T tbprdValue1Outputs = (EPwm1Regs.TBPRD + 1);

  /*-- Update CMPA value for ePWM1 --*/
  {
    EPwm1Regs.CMPA.bit.CMPA = (uint16_T)(rtb_TF);
  }

  if (tmp) {
    /* DiscretePulseGenerator: '<Root>/Pulse Generator' */
    part4_implement_starter_B.PulseGenerator =
      (part4_implement_starter_DW.clockTickCounter <
       part4_implement_starter_P.PulseGenerator_Duty) &&
      (part4_implement_starter_DW.clockTickCounter >= 0L) ?
      part4_implement_starter_P.PulseGenerator_Amp : 0.0;

    /* DiscretePulseGenerator: '<Root>/Pulse Generator' */
    if (part4_implement_starter_DW.clockTickCounter >=
        part4_implement_starter_P.PulseGenerator_Period - 1.0) {
      part4_implement_starter_DW.clockTickCounter = 0L;
    } else {
      part4_implement_starter_DW.clockTickCounter++;
    }

    /* Switch: '<Root>/Switch1' incorporates:
     *  Constant: '<Root>/Constant2'
     */
    if (part4_implement_starter_P.StartStop___PWM >
        part4_implement_starter_P.Switch1_Threshold_n) {
      /* Switch: '<Root>/Switch1' incorporates:
       *  Constant: '<Root>/Constant3'
       */
      part4_implement_starter_B.Switch1 =
        part4_implement_starter_P.Constant3_Value;
    } else {
      /* Switch: '<Root>/Switch1' */
      part4_implement_starter_B.Switch1 =
        part4_implement_starter_B.PulseGenerator;
    }

    /* End of Switch: '<Root>/Switch1' */

    /* S-Function (c280xgpio_do): '<Root>/GPIO31' */
    {
      if (part4_implement_starter_B.Switch1) {
        GpioDataRegs.GPASET.bit.GPIO31 = 1U;
      } else {
        GpioDataRegs.GPACLEAR.bit.GPIO31 = 1U;
      }
    }

    /* S-Function (c280xgpio_do): '<Root>/GPIO34' */
    {
      if (part4_implement_starter_B.PulseGenerator) {
        GpioDataRegs.GPBSET.bit.GPIO34 = 1U;
      } else {
        GpioDataRegs.GPBCLEAR.bit.GPIO34 = 1U;
      }
    }

    /* Outputs for Triggered SubSystem: '<S2>/Triggered Subsystem' incorporates:
     *  TriggerPort: '<S3>/Trigger'
     */
    if (rtsiIsModeUpdateTimeStep(&part4_implement_starter_M->solverInfo)) {
      /* Constant: '<Root>/Constant9' */
      zcEvent = rt_ZCFcn(RISING_ZERO_CROSSING,
                         &part4_implement_starter_PrevZCX.TriggeredSubsystem_Trig_ZCE,
                         (part4_implement_starter_P.Constant9_Value));
      if (zcEvent != NO_ZCEVENT) {
        /* SignalConversion generated from: '<S3>/In1' incorporates:
         *  Constant: '<S2>/Constant8'
         */
        part4_implement_starter_B.In1 =
          part4_implement_starter_P.Constant8_Value;
        part4_implement_starter_DW.TriggeredSubsystem_SubsysRanBC = 4;
      }
    }

    /* End of Outputs for SubSystem: '<S2>/Triggered Subsystem' */

    /* Stop: '<S2>/Stop Simulation' */
    if (part4_implement_starter_B.In1 != 0.0) {
      rtmSetStopRequested(part4_implement_starter_M, 1);
    }

    /* End of Stop: '<S2>/Stop Simulation' */
  }

  if (rtmIsMajorTimeStep(part4_implement_starter_M)) {
    if (rtmIsMajorTimeStep(part4_implement_starter_M)) {/* Sample time: [0.002s, 0.0s] */
      extmodeErrorCode_T errorCode = EXTMODE_SUCCESS;
      extmodeSimulationTime_T extmodeTime = (extmodeSimulationTime_T)
        ((part4_implement_starter_M->Timing.clockTick1 * 1) + 0);

      /* Trigger External Mode event */
      errorCode = extmodeEvent(1, extmodeTime);
      if (errorCode != EXTMODE_SUCCESS) {
        /* Code to handle External Mode event errors
           may be added here */
      }
    }
  }                                    /* end MajorTimeStep */

  if (rtmIsMajorTimeStep(part4_implement_starter_M)) {
    rt_ertODEUpdateContinuousStates(&part4_implement_starter_M->solverInfo);

    /* Update absolute time for base rate */
    /* The "clockTick0" counts the number of times the code of this task has
     * been executed. The absolute time is the multiplication of "clockTick0"
     * and "Timing.stepSize0". Size of "clockTick0" ensures timer will not
     * overflow during the application lifespan selected.
     */
    ++part4_implement_starter_M->Timing.clockTick0;
    part4_implement_starter_M->Timing.t[0] = rtsiGetSolverStopTime
      (&part4_implement_starter_M->solverInfo);

    {
      /* Update absolute timer for sample time: [0.002s, 0.0s] */
      /* The "clockTick1" counts the number of times the code of this task has
       * been executed. The resolution of this integer timer is 0.002, which is the step size
       * of the task. Size of "clockTick1" ensures timer will not overflow during the
       * application lifespan selected.
       */
      part4_implement_starter_M->Timing.clockTick1++;
    }
  }                                    /* end MajorTimeStep */
}

/* Derivatives for root system: '<Root>' */
void part4_implement_starter_derivatives(void)
{
  XDot_part4_implement_starter_T *_rtXdot;
  _rtXdot = ((XDot_part4_implement_starter_T *)
             part4_implement_starter_M->derivs);

  /* Derivatives for TransferFcn: '<Root>/Transfer Fcn' */
  _rtXdot->TransferFcn_CSTATE = part4_implement_starter_P.TransferFcn_A *
    part4_implement_starter_X.TransferFcn_CSTATE;
  _rtXdot->TransferFcn_CSTATE += part4_implement_starter_B.Sum7;

  /* Derivatives for TransferFcn: '<Root>/Transfer Fcn1' */
  _rtXdot->TransferFcn1_CSTATE = part4_implement_starter_P.TransferFcn1_A *
    part4_implement_starter_X.TransferFcn1_CSTATE;
  _rtXdot->TransferFcn1_CSTATE += part4_implement_starter_B.phi_p_Gain;
}

/* Model initialize function */
void part4_implement_starter_initialize(void)
{
  /* Registration code */

  /* initialize real-time model */
  (void) memset((void *)part4_implement_starter_M, 0,
                sizeof(RT_MODEL_part4_implement_star_T));

  {
    /* Setup solver object */
    rtsiSetSimTimeStepPtr(&part4_implement_starter_M->solverInfo,
                          &part4_implement_starter_M->Timing.simTimeStep);
    rtsiSetTPtr(&part4_implement_starter_M->solverInfo, &rtmGetTPtr
                (part4_implement_starter_M));
    rtsiSetStepSizePtr(&part4_implement_starter_M->solverInfo,
                       &part4_implement_starter_M->Timing.stepSize0);
    rtsiSetdXPtr(&part4_implement_starter_M->solverInfo,
                 &part4_implement_starter_M->derivs);
    rtsiSetContStatesPtr(&part4_implement_starter_M->solverInfo, (real_T **)
                         &part4_implement_starter_M->contStates);
    rtsiSetNumContStatesPtr(&part4_implement_starter_M->solverInfo,
      &part4_implement_starter_M->Sizes.numContStates);
    rtsiSetNumPeriodicContStatesPtr(&part4_implement_starter_M->solverInfo,
      &part4_implement_starter_M->Sizes.numPeriodicContStates);
    rtsiSetPeriodicContStateIndicesPtr(&part4_implement_starter_M->solverInfo,
      &part4_implement_starter_M->periodicContStateIndices);
    rtsiSetPeriodicContStateRangesPtr(&part4_implement_starter_M->solverInfo,
      &part4_implement_starter_M->periodicContStateRanges);
    rtsiSetContStateDisabledPtr(&part4_implement_starter_M->solverInfo,
      (boolean_T**) &part4_implement_starter_M->contStateDisabled);
    rtsiSetErrorStatusPtr(&part4_implement_starter_M->solverInfo,
                          (&rtmGetErrorStatus(part4_implement_starter_M)));
    rtsiSetRTModelPtr(&part4_implement_starter_M->solverInfo,
                      part4_implement_starter_M);
  }

  rtsiSetSimTimeStep(&part4_implement_starter_M->solverInfo, MAJOR_TIME_STEP);
  rtsiSetIsMinorTimeStepWithModeChange(&part4_implement_starter_M->solverInfo,
    false);
  rtsiSetIsContModeFrozen(&part4_implement_starter_M->solverInfo, false);
  part4_implement_starter_M->intgData.f[0] = part4_implement_starter_M->odeF[0];
  part4_implement_starter_M->contStates = ((X_part4_implement_starter_T *)
    &part4_implement_starter_X);
  part4_implement_starter_M->contStateDisabled =
    ((XDis_part4_implement_starter_T *) &part4_implement_starter_XDis);
  part4_implement_starter_M->Timing.tStart = (0.0);
  rtsiSetSolverData(&part4_implement_starter_M->solverInfo, (void *)
                    &part4_implement_starter_M->intgData);
  rtsiSetSolverName(&part4_implement_starter_M->solverInfo,"ode1");
  rtmSetTPtr(part4_implement_starter_M,
             &part4_implement_starter_M->Timing.tArray[0]);
  rtmSetTFinal(part4_implement_starter_M, 400.0);
  part4_implement_starter_M->Timing.stepSize0 = 0.002;

  /* External mode info */
  part4_implement_starter_M->Sizes.checksums[0] = (91927418U);
  part4_implement_starter_M->Sizes.checksums[1] = (727478846U);
  part4_implement_starter_M->Sizes.checksums[2] = (1393806970U);
  part4_implement_starter_M->Sizes.checksums[3] = (2292636622U);

  {
    static const sysRanDType rtAlwaysEnabled = SUBSYS_RAN_BC_ENABLE;
    static RTWExtModeInfo rt_ExtModeInfo;
    static const sysRanDType *systemRan[7];
    part4_implement_starter_M->extModeInfo = (&rt_ExtModeInfo);
    rteiSetSubSystemActiveVectorAddresses(&rt_ExtModeInfo, systemRan);
    systemRan[0] = &rtAlwaysEnabled;
    systemRan[1] = &rtAlwaysEnabled;
    systemRan[2] = &rtAlwaysEnabled;
    systemRan[3] = &rtAlwaysEnabled;
    systemRan[4] = &rtAlwaysEnabled;
    systemRan[5] = (sysRanDType *)
      &part4_implement_starter_DW.TriggeredSubsystem_SubsysRanBC;
    systemRan[6] = &rtAlwaysEnabled;
    rteiSetModelMappingInfoPtr(part4_implement_starter_M->extModeInfo,
      &part4_implement_starter_M->SpecialInfo.mappingInfo);
    rteiSetChecksumsPtr(part4_implement_starter_M->extModeInfo,
                        part4_implement_starter_M->Sizes.checksums);
    rteiSetTFinalTicks(part4_implement_starter_M->extModeInfo, 200000);
  }

  /* block I/O */
  (void) memset(((void *) &part4_implement_starter_B), 0,
                sizeof(B_part4_implement_starter_T));

  /* states (continuous) */
  {
    (void) memset((void *)&part4_implement_starter_X, 0,
                  sizeof(X_part4_implement_starter_T));
  }

  /* disabled states */
  {
    (void) memset((void *)&part4_implement_starter_XDis, 0,
                  sizeof(XDis_part4_implement_starter_T));
  }

  /* states (dwork) */
  (void) memset((void *)&part4_implement_starter_DW, 0,
                sizeof(DW_part4_implement_starter_T));

  /* Start for S-Function (c280xqep): '<S2>/eQEP' */
  config_QEP_eQEP1((uint32_T)4294967295U,(uint32_T)0, (uint32_T)0, (uint32_T)0,
                   (uint16_T)0, (uint16_T)0, (uint16_T)4104, (uint16_T)32768,
                   (uint16_T)119,(uint16_T)0);

  /* Start for S-Function (c280xqep): '<S2>/eQEP1' */
  config_QEP_eQEP2((uint32_T)4294967295U,(uint32_T)0, (uint32_T)0, (uint32_T)0,
                   (uint16_T)0, (uint16_T)0, (uint16_T)4104, (uint16_T)32768,
                   (uint16_T)119,(uint16_T)0);

  /* Start for S-Function (c2802xpwm): '<S2>/ePWM' */
  real32_T tbprdValue1 = (real32_T)(EPwm1Regs.TBPRD + 1);

  /*** Initialize ePWM1 modules ***/
  {
    /*  -- Time Base Control Register
       EPwm1Regs.TBCTL.bit.CTRMODE              = 0U;          -- Counter Mode
       EPwm1Regs.TBCTL.bit.SYNCOSEL             = 3U;          -- Sync Output Select
       EPwm1Regs.TBCTL2.bit.SYNCOSELX           = 0U;          -- Sync Output Select - additional options

       EPwm1Regs.TBCTL.bit.PRDLD                = 0U;          -- Shadow select

       EPwm1Regs.TBCTL2.bit.PRDLDSYNC           = 0U;          -- Shadow select

       EPwm1Regs.TBCTL.bit.PHSEN                = 0U;          -- Phase Load Enable
       EPwm1Regs.TBCTL.bit.PHSDIR               = 0U;          -- Phase Direction Bit
       EPwm1Regs.TBCTL.bit.HSPCLKDIV            = 0U;          -- High Speed TBCLK Pre-scaler
       EPwm1Regs.TBCTL.bit.CLKDIV               = 0U;          -- Time Base Clock Pre-scaler
     */
    EPwm1Regs.TBCTL.all = (EPwm1Regs.TBCTL.all & ~0x3FFFU) | 0x30U;
    EPwm1Regs.TBCTL2.all = (EPwm1Regs.TBCTL2.all & ~0xF000U) | 0x0U;

    /*-- Setup Time-Base (TB) Submodule --*/
    EPwm1Regs.TBPRD = 5000U;           // Time Base Period Register

    /* -- Time-Base Phase Register
       EPwm1Regs.TBPHS.bit.TBPHS               = 0U;          -- Phase offset register
     */
    EPwm1Regs.TBPHS.all = (EPwm1Regs.TBPHS.all & ~0xFFFF0000U) | 0x0U;

    // Time Base Counter Register
    EPwm1Regs.TBCTR = 0x0000U;         /* Clear counter*/

    /*-- Setup Counter_Compare (CC) Submodule --*/
    /*	-- Counter Compare Control Register

       EPwm1Regs.CMPCTL.bit.LOADASYNC           = 0U;          -- Active Compare A Load SYNC Option
       EPwm1Regs.CMPCTL.bit.LOADBSYNC           = 0U;          -- Active Compare B Load SYNC Option
       EPwm1Regs.CMPCTL.bit.LOADAMODE           = 0U;          -- Active Compare A Load
       EPwm1Regs.CMPCTL.bit.LOADBMODE           = 0U;          -- Active Compare B Load
       EPwm1Regs.CMPCTL.bit.SHDWAMODE           = 0U;          -- Compare A Register Block Operating Mode
       EPwm1Regs.CMPCTL.bit.SHDWBMODE           = 0U;          -- Compare B Register Block Operating Mode
     */
    EPwm1Regs.CMPCTL.all = (EPwm1Regs.CMPCTL.all & ~0x3C5FU) | 0x0U;

    /* EPwm1Regs.CMPCTL2.bit.SHDWCMODE           = 0U;          -- Compare C Register Block Operating Mode
       EPwm1Regs.CMPCTL2.bit.SHDWDMODE           = 0U;          -- Compare D Register Block Operating Mode
       EPwm1Regs.CMPCTL2.bit.LOADCSYNC           = 0U;          -- Active Compare C Load SYNC Option
       EPwm1Regs.CMPCTL2.bit.LOADDSYNC           = 0U;          -- Active Compare D Load SYNC Option
       EPwm1Regs.CMPCTL2.bit.LOADCMODE           = 0U;          -- Active Compare C Load
       EPwm1Regs.CMPCTL2.bit.LOADDMODE           = 0U;          -- Active Compare D Load
     */
    EPwm1Regs.CMPCTL2.all = (EPwm1Regs.CMPCTL2.all & ~0x3C5FU) | 0x0U;
    EPwm1Regs.CMPA.bit.CMPA = 32000U;  // Counter Compare A Register
    EPwm1Regs.CMPB.bit.CMPB = 32000U;  // Counter Compare B Register
    EPwm1Regs.CMPC = 32000U;           // Counter Compare C Register
    EPwm1Regs.CMPD = 2500U;            // Counter Compare D Register

    /*-- Setup Action-Qualifier (AQ) Submodule --*/
    EPwm1Regs.AQCTLA.all = 146U;
                               // Action Qualifier Control Register For Output A
    EPwm1Regs.AQCTLB.all = 2310U;
                               // Action Qualifier Control Register For Output B

    /*	-- Action Qualifier Software Force Register
       EPwm1Regs.AQSFRC.bit.RLDCSF              = 0U;          -- Reload from Shadow Options
     */
    EPwm1Regs.AQSFRC.all = (EPwm1Regs.AQSFRC.all & ~0xC0U) | 0x0U;

    /*	-- Action Qualifier Continuous S/W Force Register
       EPwm1Regs.AQCSFRC.bit.CSFA               = 0U;          -- Continuous Software Force on output A
       EPwm1Regs.AQCSFRC.bit.CSFB               = 0U;          -- Continuous Software Force on output B
     */
    EPwm1Regs.AQCSFRC.all = (EPwm1Regs.AQCSFRC.all & ~0xFU) | 0x0U;

    /*-- Setup Dead-Band Generator (DB) Submodule --*/
    /*	-- Dead-Band Generator Control Register
       EPwm1Regs.DBCTL.bit.OUT_MODE             = 0U;          -- Dead Band Output Mode Control
       EPwm1Regs.DBCTL.bit.IN_MODE              = 0U;          -- Dead Band Input Select Mode Control
       EPwm1Regs.DBCTL.bit.POLSEL               = 0;          -- Polarity Select Control
       EPwm1Regs.DBCTL.bit.HALFCYCLE            = 0U;          -- Half Cycle Clocking Enable
       EPwm1Regs.DBCTL.bit.SHDWDBREDMODE        = 0U;          -- DBRED shadow mode
       EPwm1Regs.DBCTL.bit.SHDWDBFEDMODE        = 0U;          -- DBFED shadow mode
       EPwm1Regs.DBCTL.bit.LOADREDMODE          = 4U;        -- DBRED load
       EPwm1Regs.DBCTL.bit.LOADFEDMODE          = 4U;        -- DBFED load
     */
    EPwm1Regs.DBCTL.all = (EPwm1Regs.DBCTL.all & ~0x8FFFU) | 0x0U;
    EPwm1Regs.DBRED.bit.DBRED = (uint16_T)(0);
                         // Dead-Band Generator Rising Edge Delay Count Register
    EPwm1Regs.DBFED.bit.DBFED = (uint16_T)(0);
                        // Dead-Band Generator Falling Edge Delay Count Register

    /*-- Setup Event-Trigger (ET) Submodule --*/
    /*	-- Event Trigger Selection and Pre-Scale Register
       EPwm1Regs.ETSEL.bit.SOCAEN               = 0U;          -- Start of Conversion A Enable
       EPwm1Regs.ETSEL.bit.SOCASELCMP           = 0U;
       EPwm1Regs.ETSEL.bit.SOCASEL              = 1U;          -- Start of Conversion A Select
       EPwm1Regs.ETPS.bit.SOCPSSEL              = 1U;          -- EPWM1SOC Period Select
       EPwm1Regs.ETSOCPS.bit.SOCAPRD2           = 1U;
       EPwm1Regs.ETSEL.bit.SOCBEN               = 0U;          -- Start of Conversion B Enable
       EPwm1Regs.ETSEL.bit.SOCBSELCMP           = 0U;
       EPwm1Regs.ETSEL.bit.SOCBSEL              = 1U;          -- Start of Conversion A Select
       EPwm1Regs.ETPS.bit.SOCPSSEL              = 1;          -- EPWM1SOCB Period Select
       EPwm1Regs.ETSOCPS.bit.SOCBPRD2           = 1U;
       EPwm1Regs.ETSEL.bit.INTEN                = 0U;          -- EPWM1INTn Enable
       EPwm1Regs.ETSEL.bit.INTSELCMP            = 0U;
       EPwm1Regs.ETSEL.bit.INTSEL               = 1U;          -- Start of Conversion A Select
       EPwm1Regs.ETPS.bit.INTPSSEL              = 1U;          // EPWM1INTn Period Select
       EPwm1Regs.ETINTPS.bit.INTPRD2            = 1U;
     */
    EPwm1Regs.ETSEL.all = (EPwm1Regs.ETSEL.all & ~0xFF7FU) | 0x1101U;
    EPwm1Regs.ETPS.all = (EPwm1Regs.ETPS.all & ~0x30U) | 0x30U;
    EPwm1Regs.ETSOCPS.all = (EPwm1Regs.ETSOCPS.all & ~0xF0FU) | 0x101U;
    EPwm1Regs.ETINTPS.all = (EPwm1Regs.ETINTPS.all & ~0xFU) | 0x1U;

    /*-- Setup PWM-Chopper (PC) Submodule --*/
    /*	-- PWM Chopper Control Register
       EPwm1Regs.PCCTL.bit.CHPEN                = 0U;          -- PWM chopping enable
       EPwm1Regs.PCCTL.bit.CHPFREQ              = 0U;          -- Chopping clock frequency
       EPwm1Regs.PCCTL.bit.OSHTWTH              = 0U;          -- One-shot pulse width
       EPwm1Regs.PCCTL.bit.CHPDUTY              = 0U;          -- Chopping clock Duty cycle
     */
    EPwm1Regs.PCCTL.all = (EPwm1Regs.PCCTL.all & ~0x7FFU) | 0x0U;

    /*-- Set up Trip-Zone (TZ) Submodule --*/
    EALLOW;
    EPwm1Regs.TZSEL.all = 0U;          // Trip Zone Select Register

    /*	-- Trip Zone Control Register
       EPwm1Regs.TZCTL.bit.TZA                  = 3U;          -- TZ1 to TZ6 Trip Action On EPWM1A
       EPwm1Regs.TZCTL.bit.TZB                  = 3U;          -- TZ1 to TZ6 Trip Action On EPWM1B
       EPwm1Regs.TZCTL.bit.DCAEVT1              = 3U;          -- EPWM1A action on DCAEVT1
       EPwm1Regs.TZCTL.bit.DCAEVT2              = 3U;          -- EPWM1A action on DCAEVT2
       EPwm1Regs.TZCTL.bit.DCBEVT1              = 3U;          -- EPWM1B action on DCBEVT1
       EPwm1Regs.TZCTL.bit.DCBEVT2              = 3U;          -- EPWM1B action on DCBEVT2
     */
    EPwm1Regs.TZCTL.all = (EPwm1Regs.TZCTL.all & ~0xFFFU) | 0xFFFU;

    /*	-- Trip Zone Enable Interrupt Register
       EPwm1Regs.TZEINT.bit.OST                 = 0U;          -- Trip Zones One Shot Int Enable
       EPwm1Regs.TZEINT.bit.CBC                 = 0U;          -- Trip Zones Cycle By Cycle Int Enable
       EPwm1Regs.TZEINT.bit.DCAEVT1             = 0U;          -- Digital Compare A Event 1 Int Enable
       EPwm1Regs.TZEINT.bit.DCAEVT2             = 0U;          -- Digital Compare A Event 2 Int Enable
       EPwm1Regs.TZEINT.bit.DCBEVT1             = 0U;          -- Digital Compare B Event 1 Int Enable
       EPwm1Regs.TZEINT.bit.DCBEVT2             = 0U;          -- Digital Compare B Event 2 Int Enable
     */
    EPwm1Regs.TZEINT.all = (EPwm1Regs.TZEINT.all & ~0x7EU) | 0x0U;

    /*	-- Digital Compare A Control Register
       EPwm1Regs.DCACTL.bit.EVT1SYNCE           = 0U;          -- DCAEVT1 SYNC Enable
       EPwm1Regs.DCACTL.bit.EVT1SOCE            = 1U;          -- DCAEVT1 SOC Enable
       EPwm1Regs.DCACTL.bit.EVT1FRCSYNCSEL      = 0U;          -- DCAEVT1 Force Sync Signal
       EPwm1Regs.DCACTL.bit.EVT1SRCSEL          = 0U;          -- DCAEVT1 Source Signal
       EPwm1Regs.DCACTL.bit.EVT2FRCSYNCSEL      = 0U;          -- DCAEVT2 Force Sync Signal
       EPwm1Regs.DCACTL.bit.EVT2SRCSEL          = 0U;          -- DCAEVT2 Source Signal
     */
    EPwm1Regs.DCACTL.all = (EPwm1Regs.DCACTL.all & ~0x30FU) | 0x4U;

    /*	-- Digital Compare B Control Register
       EPwm1Regs.DCBCTL.bit.EVT1SYNCE           = 0U;          -- DCBEVT1 SYNC Enable
       EPwm1Regs.DCBCTL.bit.EVT1SOCE            = 0U;          -- DCBEVT1 SOC Enable
       EPwm1Regs.DCBCTL.bit.EVT1FRCSYNCSEL      = 0U;          -- DCBEVT1 Force Sync Signal
       EPwm1Regs.DCBCTL.bit.EVT1SRCSEL          = 0U;          -- DCBEVT1 Source Signal
       EPwm1Regs.DCBCTL.bit.EVT2FRCSYNCSEL      = 0U;          -- DCBEVT2 Force Sync Signal
       EPwm1Regs.DCBCTL.bit.EVT2SRCSEL          = 0U;          -- DCBEVT2 Source Signal
     */
    EPwm1Regs.DCBCTL.all = (EPwm1Regs.DCBCTL.all & ~0x30FU) | 0x0U;

    /*	-- Digital Compare Trip Select Register
       EPwm1Regs.DCTRIPSEL.bit.DCAHCOMPSEL      = 0U;          -- Digital Compare A High COMP Input Select

       EPwm1Regs.DCTRIPSEL.bit.DCALCOMPSEL      = 0U;          -- Digital Compare A Low COMP Input Select
       EPwm1Regs.DCTRIPSEL.bit.DCBHCOMPSEL      = 0U;          -- Digital Compare B High COMP Input Select
       EPwm1Regs.DCTRIPSEL.bit.DCBLCOMPSEL      = 0U;          -- Digital Compare B Low COMP Input Select
     */
    EPwm1Regs.DCTRIPSEL.all = (EPwm1Regs.DCTRIPSEL.all & ~ 0xFFFFU) | 0x0U;

    /*	-- Trip Zone Digital Comparator Select Register
       EPwm1Regs.TZDCSEL.bit.DCAEVT1            = 0U;          -- Digital Compare Output A Event 1
       EPwm1Regs.TZDCSEL.bit.DCAEVT2            = 0U;          -- Digital Compare Output A Event 2
       EPwm1Regs.TZDCSEL.bit.DCBEVT1            = 0U;          -- Digital Compare Output B Event 1
       EPwm1Regs.TZDCSEL.bit.DCBEVT2            = 0U;          -- Digital Compare Output B Event 2
     */
    EPwm1Regs.TZDCSEL.all = (EPwm1Regs.TZDCSEL.all & ~0xFFFU) | 0x0U;

    /*	-- Digital Compare Filter Control Register
       EPwm1Regs.DCFCTL.bit.BLANKE              = 0U;          -- Blanking Enable/Disable
       EPwm1Regs.DCFCTL.bit.PULSESEL            = 1U;          -- Pulse Select for Blanking & Capture Alignment
       EPwm1Regs.DCFCTL.bit.BLANKINV            = 0U;          -- Blanking Window Inversion
       EPwm1Regs.DCFCTL.bit.SRCSEL              = 0U;          -- Filter Block Signal Source Select
     */
    EPwm1Regs.DCFCTL.all = (EPwm1Regs.DCFCTL.all & ~0x3FU) | 0x10U;
    EPwm1Regs.DCFOFFSET = 0U;          // Digital Compare Filter Offset Register
    EPwm1Regs.DCFWINDOW = 0U;          // Digital Compare Filter Window Register

    /*	-- Digital Compare Capture Control Register
       EPwm1Regs.DCCAPCTL.bit.CAPE              = 0U;          -- Counter Capture Enable
     */
    EPwm1Regs.DCCAPCTL.all = (EPwm1Regs.DCCAPCTL.all & ~0x1U) | 0x0U;

    /*	-- HRPWM Configuration Register
       EPwm1Regs.HRCNFG.bit.SWAPAB              = 0U;          -- Swap EPWMA and EPWMB Outputs Bit
       EPwm1Regs.HRCNFG.bit.SELOUTB             = 0U;          -- EPWMB Output Selection Bit
     */
    EPwm1Regs.HRCNFG.all = (EPwm1Regs.HRCNFG.all & ~0xA0U) | 0x0U;

    /* Update the Link Registers with the link value for all the Compare values and TBPRD */
    /* No error is thrown if the ePWM register exists in the model or not */
    EPwm1Regs.EPWMXLINK.bit.TBPRDLINK = 0U;
    EPwm1Regs.EPWMXLINK.bit.CMPALINK = 0U;
    EPwm1Regs.EPWMXLINK.bit.CMPBLINK = 0U;
    EPwm1Regs.EPWMXLINK.bit.CMPCLINK = 0U;
    EPwm1Regs.EPWMXLINK.bit.CMPDLINK = 0U;

    /* SYNCPER - Peripheral synchronization output event
       EPwm1Regs.HRPCTL.bit.PWMSYNCSEL            = 0U;          -- EPWMSYNCPER selection
       EPwm1Regs.HRPCTL.bit.PWMSYNCSELX           = 0U;          --  EPWMSYNCPER selection
     */
    EPwm1Regs.HRPCTL.all = (EPwm1Regs.HRPCTL.all & ~0x72U) | 0x0U;
    EDIS;
  }

  /* Start for DiscretePulseGenerator: '<Root>/Pulse Generator' */
  part4_implement_starter_DW.clockTickCounter = 0L;

  /* Start for S-Function (c280xgpio_do): '<Root>/GPIO31' */
  EALLOW;
  GpioCtrlRegs.GPAMUX2.all &= 0x3FFFFFFFU;
  GpioCtrlRegs.GPADIR.all |= 0x80000000U;
  EDIS;

  /* Start for S-Function (c280xgpio_do): '<Root>/GPIO34' */
  EALLOW;
  GpioCtrlRegs.GPBMUX1.all &= 0xFFFFFFCFU;
  GpioCtrlRegs.GPBDIR.all |= 0x4U;
  EDIS;
  part4_implement_starter_PrevZCX.TriggeredSubsystem_Trig_ZCE =
    UNINITIALIZED_ZCSIG;

  /* InitializeConditions for TransferFcn: '<Root>/Transfer Fcn' */
  part4_implement_starter_X.TransferFcn_CSTATE = 0.0;

  /* InitializeConditions for TransferFcn: '<Root>/Transfer Fcn1' */
  part4_implement_starter_X.TransferFcn1_CSTATE = 0.0;

  /* SystemInitialize for Triggered SubSystem: '<S2>/Triggered Subsystem' */
  /* SystemInitialize for SignalConversion generated from: '<S3>/In1' incorporates:
   *  Outport: '<S3>/Out1'
   */
  part4_implement_starter_B.In1 = part4_implement_starter_P.Out1_Y0;

  /* End of SystemInitialize for SubSystem: '<S2>/Triggered Subsystem' */
}

/* Model terminate function */
void part4_implement_starter_terminate(void)
{
  /* (no terminate code required) */
}

/*
 * File trailer for generated code.
 *
 * [EOF]
 */
