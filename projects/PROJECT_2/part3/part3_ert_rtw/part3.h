/*
 * Academic License - for use in teaching, academic research, and meeting
 * course requirements at degree granting institutions only.  Not for
 * government, commercial, or other organizational use.
 *
 * File: part3.h
 *
 * Code generated for Simulink model 'part3'.
 *
 * Model version                  : 9.23
 * Simulink Coder version         : 24.2 (R2024b) 21-Jun-2024
 * C/C++ source code generated on : Tue Nov 18 09:36:10 2025
 *
 * Target selection: ert.tlc
 * Embedded hardware selection: Texas Instruments->C2000
 * Code generation objectives: Unspecified
 * Validation result: Not run
 */

#ifndef part3_h_
#define part3_h_
#ifndef part3_COMMON_INCLUDES_
#define part3_COMMON_INCLUDES_
#include "rtwtypes.h"
#include "rtw_extmode.h"
#include "sysran_types.h"
#include "rtw_continuous.h"
#include "rtw_solver.h"
#include "c2000BoardSupport.h"
#include "MW_f2837xD_includes.h"
#include "IQmathLib.h"
#endif                                 /* part3_COMMON_INCLUDES_ */

#include "part3_types.h"
#include "rt_zcfcn.h"
#include <string.h>
#include "zero_crossing_types.h"
#include "MW_target_hardware_resources.h"

/* Macros for accessing real-time model data structure */
#ifndef rtmGetFinalTime
#define rtmGetFinalTime(rtm)           ((rtm)->Timing.tFinal)
#endif

#ifndef rtmGetRTWExtModeInfo
#define rtmGetRTWExtModeInfo(rtm)      ((rtm)->extModeInfo)
#endif

#ifndef rtmGetErrorStatus
#define rtmGetErrorStatus(rtm)         ((rtm)->errorStatus)
#endif

#ifndef rtmSetErrorStatus
#define rtmSetErrorStatus(rtm, val)    ((rtm)->errorStatus = (val))
#endif

#ifndef rtmGetStopRequested
#define rtmGetStopRequested(rtm)       ((rtm)->Timing.stopRequestedFlag)
#endif

#ifndef rtmSetStopRequested
#define rtmSetStopRequested(rtm, val)  ((rtm)->Timing.stopRequestedFlag = (val))
#endif

#ifndef rtmGetStopRequestedPtr
#define rtmGetStopRequestedPtr(rtm)    (&((rtm)->Timing.stopRequestedFlag))
#endif

#ifndef rtmGetT
#define rtmGetT(rtm)                   ((rtm)->Timing.taskTime0)
#endif

#ifndef rtmGetTFinal
#define rtmGetTFinal(rtm)              ((rtm)->Timing.tFinal)
#endif

#ifndef rtmGetTPtr
#define rtmGetTPtr(rtm)                (&(rtm)->Timing.taskTime0)
#endif

extern void config_ePWMSyncSource(void);
extern void config_ePWM_GPIO (void);
extern void config_ePWM_TBSync (void);
extern void config_ePWM_XBAR(void);

/* Block signals (default storage) */
typedef struct {
  real_T Gain1;                        /* '<Root>/Gain1' */
  real_T Gain2;                        /* '<Root>/Gain2' */
  real_T Sum7;                         /* '<Root>/Sum7' */
  real_T Switch;                       /* '<Root>/Switch' */
  real_T TmpSignalConversionAtTAQSigLogg[3];
  /* '<Root>/TmpSignal ConversionAtTAQSigLogging_InsertedFor_Mux_at_outport_0Inport1' */
  real_T In1;                          /* '<S2>/In1' */
  real_T PulseGenerator;               /* '<Root>/Pulse Generator' */
  real_T Switch1;                      /* '<Root>/Switch1' */
  int32_T eQEP1;                       /* '<S1>/eQEP1' */
  int32_T eQEP;                        /* '<S1>/eQEP' */
} B_part3_T;

/* Block states (default storage) for system '<Root>' */
typedef struct {
  struct {
    void *LoggedData;
  } Theta_pTheta_rcontroleffort_PWO;
                               /* '<Root>/Theta_p, Theta_r, & control effort' */

  struct {
    void *LoggedData;
  } Motorphi_r_PWORK;                  /* '<Root>/Motor phi_r' */

  int32_T clockTickCounter;            /* '<Root>/Pulse Generator' */
  int32_T GPIO31_FRAC_LEN;             /* '<Root>/GPIO31' */
  int32_T GPIO34_FRAC_LEN;             /* '<Root>/GPIO34' */
  int16_T TriggeredSubsystem_SubsysRanBC;/* '<S1>/Triggered Subsystem' */
} DW_part3_T;

/* Zero-crossing (trigger) state */
typedef struct {
  ZCSigState TriggeredSubsystem_Trig_ZCE;/* '<S1>/Triggered Subsystem' */
} PrevZCX_part3_T;

/* Parameters (default storage) */
struct P_part3_T_ {
  real_T StartStop___PWM;              /* Variable: StartStop___PWM
                                        * Referenced by:
                                        *   '<Root>/Constant2'
                                        *   '<Root>/Constant7'
                                        */
  real_T Constant6_Value;              /* Expression: 0
                                        * Referenced by: '<S1>/Constant6'
                                        */
  real_T Gain3_Gain;                   /* Expression: -1
                                        * Referenced by: '<Root>/Gain3'
                                        */
  real_T Out1_Y0;                      /* Computed Parameter: Out1_Y0
                                        * Referenced by: '<S2>/Out1'
                                        */
  real_T Constant3_Value;              /* Expression: 1
                                        * Referenced by: '<Root>/Constant3'
                                        */
  real_T Constant_Value;               /* Expression: 0
                                        * Referenced by: '<Root>/Constant'
                                        */
  real_T Constant1_Value;              /* Expression: 5
                                        * Referenced by: '<Root>/Constant1'
                                        */
  real_T Gain1_Gain;                   /* Expression: -(2*pi)/5000
                                        * Referenced by: '<Root>/Gain1'
                                        */
  real_T Gain2_Gain;                   /* Expression: (2*pi)/4000
                                        * Referenced by: '<Root>/Gain2'
                                        */
  real_T Switch_Threshold;             /* Expression: .5
                                        * Referenced by: '<Root>/Switch'
                                        */
  real_T Constant9_Value;              /* Expression: 0
                                        * Referenced by: '<Root>/Constant9'
                                        */
  real_T Gain_Gain;                    /* Expression: 250
                                        * Referenced by: '<S1>/Gain'
                                        */
  real_T Constant5_Value;              /* Expression: 2500
                                        * Referenced by: '<S1>/Constant5'
                                        */
  real_T PulseGenerator_Amp;           /* Expression: 1
                                        * Referenced by: '<Root>/Pulse Generator'
                                        */
  real_T PulseGenerator_Period;     /* Computed Parameter: PulseGenerator_Period
                                     * Referenced by: '<Root>/Pulse Generator'
                                     */
  real_T PulseGenerator_Duty;         /* Computed Parameter: PulseGenerator_Duty
                                       * Referenced by: '<Root>/Pulse Generator'
                                       */
  real_T PulseGenerator_PhaseDelay;    /* Expression: 0
                                        * Referenced by: '<Root>/Pulse Generator'
                                        */
  real_T Switch1_Threshold;            /* Expression: 0
                                        * Referenced by: '<Root>/Switch1'
                                        */
  real_T Constant8_Value;              /* Expression: 1
                                        * Referenced by: '<S1>/Constant8'
                                        */
};

/* Real-time Model Data Structure */
struct tag_RTM_part3_T {
  const char_T *errorStatus;
  RTWExtModeInfo *extModeInfo;

  /*
   * Sizes:
   * The following substructure contains sizes information
   * for many of the model attributes such as inputs, outputs,
   * dwork, sample times, etc.
   */
  struct {
    uint32_T checksums[4];
  } Sizes;

  /*
   * SpecialInfo:
   * The following substructure contains special information
   * related to other components that are dependent on RTW.
   */
  struct {
    const void *mappingInfo;
  } SpecialInfo;

  /*
   * Timing:
   * The following substructure contains information regarding
   * the timing information for the model.
   */
  struct {
    time_T taskTime0;
    uint32_T clockTick0;
    time_T stepSize0;
    time_T tFinal;
    boolean_T stopRequestedFlag;
  } Timing;
};

/* Block parameters (default storage) */
extern P_part3_T part3_P;

/* Block signals (default storage) */
extern B_part3_T part3_B;

/* Block states (default storage) */
extern DW_part3_T part3_DW;

/* Zero-crossing (trigger) state */
extern PrevZCX_part3_T part3_PrevZCX;

/* Model entry point functions */
extern void part3_initialize(void);
extern void part3_step(void);
extern void part3_terminate(void);

/* Real-time Model object */
extern RT_MODEL_part3_T *const part3_M;
extern volatile boolean_T stopRequested;
extern volatile boolean_T runModel;

/*-
 * The generated code includes comments that allow you to trace directly
 * back to the appropriate location in the model.  The basic format
 * is <system>/block_name, where system is the system number (uniquely
 * assigned by Simulink) and block_name is the name of the block.
 *
 * Use the MATLAB hilite_system command to trace the generated code back
 * to the model.  For example,
 *
 * hilite_system('<S3>')    - opens system 3
 * hilite_system('<S3>/Kp') - opens and selects block Kp which resides in S3
 *
 * Here is the system hierarchy for this model
 *
 * '<Root>' : 'part3'
 * '<S1>'   : 'part3/Reaction Wheel '
 * '<S2>'   : 'part3/Reaction Wheel /Triggered Subsystem'
 */
#endif                                 /* part3_h_ */

/*
 * File trailer for generated code.
 *
 * [EOF]
 */
