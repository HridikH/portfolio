/*
 * Academic License - for use in teaching, academic research, and meeting
 * course requirements at degree granting institutions only.  Not for
 * government, commercial, or other organizational use.
 *
 * File: part2c_starter.h
 *
 * Code generated for Simulink model 'part2c_starter'.
 *
 * Model version                  : 9.44
 * Simulink Coder version         : 24.2 (R2024b) 21-Jun-2024
 * C/C++ source code generated on : Tue Oct 28 12:09:14 2025
 *
 * Target selection: ert.tlc
 * Embedded hardware selection: Texas Instruments->C2000
 * Code generation objectives: Unspecified
 * Validation result: Not run
 */

#ifndef part2c_starter_h_
#define part2c_starter_h_
#ifndef part2c_starter_COMMON_INCLUDES_
#define part2c_starter_COMMON_INCLUDES_
#include "rtwtypes.h"
#include "rtw_extmode.h"
#include "sysran_types.h"
#include "rtw_continuous.h"
#include "rtw_solver.h"
#include "ext_mode.h"
#include "c2000BoardSupport.h"
#include "MW_f2837xD_includes.h"
#include "IQmathLib.h"
#endif                                 /* part2c_starter_COMMON_INCLUDES_ */

#include "part2c_starter_types.h"
#include "rt_zcfcn.h"
#include <string.h>
#include "zero_crossing_types.h"
#include "MW_target_hardware_resources.h"

/* Macros for accessing real-time model data structure */
#ifndef rtmGetContStateDisabled
#define rtmGetContStateDisabled(rtm)   ((rtm)->contStateDisabled)
#endif

#ifndef rtmSetContStateDisabled
#define rtmSetContStateDisabled(rtm, val) ((rtm)->contStateDisabled = (val))
#endif

#ifndef rtmGetContStates
#define rtmGetContStates(rtm)          ((rtm)->contStates)
#endif

#ifndef rtmSetContStates
#define rtmSetContStates(rtm, val)     ((rtm)->contStates = (val))
#endif

#ifndef rtmGetContTimeOutputInconsistentWithStateAtMajorStepFlag
#define rtmGetContTimeOutputInconsistentWithStateAtMajorStepFlag(rtm) ((rtm)->CTOutputIncnstWithState)
#endif

#ifndef rtmSetContTimeOutputInconsistentWithStateAtMajorStepFlag
#define rtmSetContTimeOutputInconsistentWithStateAtMajorStepFlag(rtm, val) ((rtm)->CTOutputIncnstWithState = (val))
#endif

#ifndef rtmGetDerivCacheNeedsReset
#define rtmGetDerivCacheNeedsReset(rtm) ((rtm)->derivCacheNeedsReset)
#endif

#ifndef rtmSetDerivCacheNeedsReset
#define rtmSetDerivCacheNeedsReset(rtm, val) ((rtm)->derivCacheNeedsReset = (val))
#endif

#ifndef rtmGetFinalTime
#define rtmGetFinalTime(rtm)           ((rtm)->Timing.tFinal)
#endif

#ifndef rtmGetIntgData
#define rtmGetIntgData(rtm)            ((rtm)->intgData)
#endif

#ifndef rtmSetIntgData
#define rtmSetIntgData(rtm, val)       ((rtm)->intgData = (val))
#endif

#ifndef rtmGetOdeF
#define rtmGetOdeF(rtm)                ((rtm)->odeF)
#endif

#ifndef rtmSetOdeF
#define rtmSetOdeF(rtm, val)           ((rtm)->odeF = (val))
#endif

#ifndef rtmGetPeriodicContStateIndices
#define rtmGetPeriodicContStateIndices(rtm) ((rtm)->periodicContStateIndices)
#endif

#ifndef rtmSetPeriodicContStateIndices
#define rtmSetPeriodicContStateIndices(rtm, val) ((rtm)->periodicContStateIndices = (val))
#endif

#ifndef rtmGetPeriodicContStateRanges
#define rtmGetPeriodicContStateRanges(rtm) ((rtm)->periodicContStateRanges)
#endif

#ifndef rtmSetPeriodicContStateRanges
#define rtmSetPeriodicContStateRanges(rtm, val) ((rtm)->periodicContStateRanges = (val))
#endif

#ifndef rtmGetRTWExtModeInfo
#define rtmGetRTWExtModeInfo(rtm)      ((rtm)->extModeInfo)
#endif

#ifndef rtmGetZCCacheNeedsReset
#define rtmGetZCCacheNeedsReset(rtm)   ((rtm)->zCCacheNeedsReset)
#endif

#ifndef rtmSetZCCacheNeedsReset
#define rtmSetZCCacheNeedsReset(rtm, val) ((rtm)->zCCacheNeedsReset = (val))
#endif

#ifndef rtmGetdX
#define rtmGetdX(rtm)                  ((rtm)->derivs)
#endif

#ifndef rtmSetdX
#define rtmSetdX(rtm, val)             ((rtm)->derivs = (val))
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
#define rtmGetT(rtm)                   (rtmGetTPtr((rtm))[0])
#endif

#ifndef rtmGetTFinal
#define rtmGetTFinal(rtm)              ((rtm)->Timing.tFinal)
#endif

#ifndef rtmGetTPtr
#define rtmGetTPtr(rtm)                ((rtm)->Timing.t)
#endif

#ifndef rtmGetTStart
#define rtmGetTStart(rtm)              ((rtm)->Timing.tStart)
#endif

extern void config_ePWMSyncSource(void);
extern void config_ePWM_GPIO (void);
extern void config_ePWM_TBSync (void);
extern void config_ePWM_XBAR(void);

/* Block signals (default storage) */
typedef struct {
  real_T Gain1;                        /* '<Root>/Gain1' */
  real_T Sum;                          /* '<Root>/Sum' */
  real_T diff;                         /* '<Root>/Gain2' */
  real_T TF;                           /* '<Root>/Transfer Fcn' */
  real_T ManualSwitch;                 /* '<Root>/Manual Switch' */
  real_T Sum1;                         /* '<Root>/Sum1' */
  real_T resetintegrator;              /* '<Root>/reset integrator' */
  real_T Gain4;                        /* '<Root>/Gain4' */
  real_T In1;                          /* '<S3>/In1' */
  real_T PulseGenerator;               /* '<Root>/Pulse Generator' */
  real_T Switch;                       /* '<Root>/Switch' */
  int32_T eQEP;                        /* '<S2>/eQEP' */
  int32_T eQEP1;                       /* '<S2>/eQEP1' */
  boolean_T OR;                        /* '<S2>/OR' */
} B_part2c_starter_T;

/* Block states (default storage) for system '<Root>' */
typedef struct {
  real_T UnitDelay_DSTATE;             /* '<Root>/Unit Delay' */
  struct {
    void *LoggedData;
  } theta_p_PWORK;                     /* '<Root>/theta_p' */

  struct {
    void *LoggedData[2];
  } Scope_PWORK;                       /* '<Root>/Scope' */

  struct {
    void *LoggedData;
  } theta_R_PWORK;                     /* '<Root>/theta_R' */

  int32_T clockTickCounter;            /* '<Root>/Pulse Generator' */
  int32_T GPIO31_FRAC_LEN;             /* '<Root>/GPIO31' */
  int32_T GPIO34_FRAC_LEN;             /* '<Root>/GPIO34' */
  int16_T TriggeredSubsystem_SubsysRanBC;/* '<S2>/Triggered Subsystem' */
} DW_part2c_starter_T;

/* Continuous states (default storage) */
typedef struct {
  real_T TransferFcn_CSTATE;           /* '<Root>/Transfer Fcn' */
  real_T Integrator_CSTATE;            /* '<Root>/Integrator ' */
} X_part2c_starter_T;

/* State derivatives (default storage) */
typedef struct {
  real_T TransferFcn_CSTATE;           /* '<Root>/Transfer Fcn' */
  real_T Integrator_CSTATE;            /* '<Root>/Integrator ' */
} XDot_part2c_starter_T;

/* State disabled  */
typedef struct {
  boolean_T TransferFcn_CSTATE;        /* '<Root>/Transfer Fcn' */
  boolean_T Integrator_CSTATE;         /* '<Root>/Integrator ' */
} XDis_part2c_starter_T;

/* Zero-crossing (trigger) state */
typedef struct {
  ZCSigState Integrator_Reset_ZCE;     /* '<Root>/Integrator ' */
  ZCSigState TriggeredSubsystem_Trig_ZCE;/* '<S2>/Triggered Subsystem' */
} PrevZCX_part2c_starter_T;

#ifndef ODE1_INTG
#define ODE1_INTG

/* ODE1 Integration Data */
typedef struct {
  real_T *f[1];                        /* derivatives */
} ODE1_IntgData;

#endif

/* Parameters (default storage) */
struct P_part2c_starter_T_ {
  real_T StartStop___PWM;              /* Variable: StartStop___PWM
                                        * Referenced by:
                                        *   '<Root>/Constant2'
                                        *   '<Root>/Constant7'
                                        */
  real_T AsymmetricLinearFriction_interc;
                              /* Mask Parameter: AsymmetricLinearFriction_interc
                               * Referenced by: '<S1>/Constant'
                               */
  real_T AsymmetricLinearFriction_inte_b;
                              /* Mask Parameter: AsymmetricLinearFriction_inte_b
                               * Referenced by: '<S1>/Constant1'
                               */
  real_T AsymmetricLinearFriction_slope1;
                              /* Mask Parameter: AsymmetricLinearFriction_slope1
                               * Referenced by: '<S1>/B1'
                               */
  real_T AsymmetricLinearFriction_slope2;
                              /* Mask Parameter: AsymmetricLinearFriction_slope2
                               * Referenced by: '<S1>/B2'
                               */
  real_T Saturation_UpperSat;          /* Expression: 10
                                        * Referenced by: '<Root>/Saturation'
                                        */
  real_T Saturation_LowerSat;          /* Expression: -10
                                        * Referenced by: '<Root>/Saturation'
                                        */
  real_T Out1_Y0;                      /* Computed Parameter: Out1_Y0
                                        * Referenced by: '<S3>/Out1'
                                        */
  real_T Ki_Gain;                      /* Expression: 0.1
                                        * Referenced by: '<Root>/Ki'
                                        */
  real_T Kp_Gain;                      /* Expression: 0.11
                                        * Referenced by: '<Root>/Kp'
                                        */
  real_T Switch1_Threshold;            /* Expression: 0.1
                                        * Referenced by: '<S1>/Switch1'
                                        */
  real_T Switch_Threshold;             /* Expression: 0
                                        * Referenced by: '<S1>/Switch'
                                        */
  real_T Switch2_Threshold;            /* Expression: 0.1
                                        * Referenced by: '<S1>/Switch2'
                                        */
  real_T Constant3_Value;              /* Expression: 1
                                        * Referenced by: '<Root>/Constant3'
                                        */
  real_T Gain1_Gain;                   /* Expression: -2*pi/5000
                                        * Referenced by: '<Root>/Gain1'
                                        */
  real_T Gain_Gain;                    /* Expression: 2*pi/4000
                                        * Referenced by: '<Root>/Gain'
                                        */
  real_T UnitDelay_InitialCondition;   /* Expression: 0
                                        * Referenced by: '<Root>/Unit Delay'
                                        */
  real_T Gain2_Gain;                   /* Expression: 1/0.002
                                        * Referenced by: '<Root>/Gain2'
                                        */
  real_T TransferFcn_A;                /* Computed Parameter: TransferFcn_A
                                        * Referenced by: '<Root>/Transfer Fcn'
                                        */
  real_T TransferFcn_C;                /* Computed Parameter: TransferFcn_C
                                        * Referenced by: '<Root>/Transfer Fcn'
                                        */
  real_T TransferFcn_D;                /* Computed Parameter: TransferFcn_D
                                        * Referenced by: '<Root>/Transfer Fcn'
                                        */
  real_T Constant2_Value;              /* Expression: 0
                                        * Referenced by: '<S1>/Constant2'
                                        */
  real_T Constant1_Value;              /* Expression: 0
                                        * Referenced by: '<Root>/Constant1'
                                        */
  real_T Step_Time;                    /* Expression: 1
                                        * Referenced by: '<Root>/Step'
                                        */
  real_T Step_Y0;                      /* Expression: 0
                                        * Referenced by: '<Root>/Step'
                                        */
  real_T Step_YFinal;                  /* Expression: 100
                                        * Referenced by: '<Root>/Step'
                                        */
  real_T Integrator_IC;                /* Expression: 0
                                        * Referenced by: '<Root>/Integrator '
                                        */
  real_T Constant_Value;               /* Expression: 0
                                        * Referenced by: '<Root>/Constant'
                                        */
  real_T Gain4_Gain;                   /* Expression: -1
                                        * Referenced by: '<Root>/Gain4'
                                        */
  real_T Constant6_Value;              /* Expression: 0
                                        * Referenced by: '<S2>/Constant6'
                                        */
  real_T Constant9_Value;              /* Expression: 0
                                        * Referenced by: '<Root>/Constant9'
                                        */
  real_T Gain_Gain_f;                  /* Expression: 250
                                        * Referenced by: '<S2>/Gain'
                                        */
  real_T Constant5_Value;              /* Expression: 2500
                                        * Referenced by: '<S2>/Constant5'
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
  real_T Switch_Threshold_b;           /* Expression: 0
                                        * Referenced by: '<Root>/Switch'
                                        */
  real_T Constant8_Value;              /* Expression: 1
                                        * Referenced by: '<S2>/Constant8'
                                        */
  uint16_T ManualSwitch_CurrentSetting;
                              /* Computed Parameter: ManualSwitch_CurrentSetting
                               * Referenced by: '<Root>/Manual Switch'
                               */
  uint16_T ManualSwitch2_CurrentSetting;
                             /* Computed Parameter: ManualSwitch2_CurrentSetting
                              * Referenced by: '<Root>/Manual Switch2'
                              */
  uint16_T resetintegrator_CurrentSetting;
                           /* Computed Parameter: resetintegrator_CurrentSetting
                            * Referenced by: '<Root>/reset integrator'
                            */
  uint16_T ManualSwitch1_CurrentSetting;
                             /* Computed Parameter: ManualSwitch1_CurrentSetting
                              * Referenced by: '<Root>/Manual Switch1'
                              */
};

/* Real-time Model Data Structure */
struct tag_RTM_part2c_starter_T {
  const char_T *errorStatus;
  RTWExtModeInfo *extModeInfo;
  RTWSolverInfo solverInfo;
  X_part2c_starter_T *contStates;
  int_T *periodicContStateIndices;
  real_T *periodicContStateRanges;
  real_T *derivs;
  XDis_part2c_starter_T *contStateDisabled;
  boolean_T zCCacheNeedsReset;
  boolean_T derivCacheNeedsReset;
  boolean_T CTOutputIncnstWithState;
  real_T odeF[1][2];
  ODE1_IntgData intgData;

  /*
   * Sizes:
   * The following substructure contains sizes information
   * for many of the model attributes such as inputs, outputs,
   * dwork, sample times, etc.
   */
  struct {
    uint32_T checksums[4];
    int_T numContStates;
    int_T numPeriodicContStates;
    int_T numSampTimes;
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
    uint32_T clockTick0;
    time_T stepSize0;
    uint32_T clockTick1;
    time_T tStart;
    time_T tFinal;
    SimTimeStep simTimeStep;
    boolean_T stopRequestedFlag;
    time_T *t;
    time_T tArray[2];
  } Timing;
};

/* Block parameters (default storage) */
extern P_part2c_starter_T part2c_starter_P;

/* Block signals (default storage) */
extern B_part2c_starter_T part2c_starter_B;

/* Continuous states (default storage) */
extern X_part2c_starter_T part2c_starter_X;

/* Disabled states (default storage) */
extern XDis_part2c_starter_T part2c_starter_XDis;

/* Block states (default storage) */
extern DW_part2c_starter_T part2c_starter_DW;

/* Zero-crossing (trigger) state */
extern PrevZCX_part2c_starter_T part2c_starter_PrevZCX;

/* Model entry point functions */
extern void part2c_starter_initialize(void);
extern void part2c_starter_step(void);
extern void part2c_starter_terminate(void);

/* Real-time Model object */
extern RT_MODEL_part2c_starter_T *const part2c_starter_M;
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
 * '<Root>' : 'part2c_starter'
 * '<S1>'   : 'part2c_starter/Asymmetric  Linear Friction'
 * '<S2>'   : 'part2c_starter/Reaction Wheel '
 * '<S3>'   : 'part2c_starter/Reaction Wheel /Triggered Subsystem'
 */
#endif                                 /* part2c_starter_h_ */

/*
 * File trailer for generated code.
 *
 * [EOF]
 */
