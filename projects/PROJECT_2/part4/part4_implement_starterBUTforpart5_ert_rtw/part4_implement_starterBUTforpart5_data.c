/*
 * Academic License - for use in teaching, academic research, and meeting
 * course requirements at degree granting institutions only.  Not for
 * government, commercial, or other organizational use.
 *
 * File: part4_implement_starterBUTforpart5_data.c
 *
 * Code generated for Simulink model 'part4_implement_starterBUTforpart5'.
 *
 * Model version                  : 9.25
 * Simulink Coder version         : 24.2 (R2024b) 21-Jun-2024
 * C/C++ source code generated on : Tue Dec  2 11:37:35 2025
 *
 * Target selection: ert.tlc
 * Embedded hardware selection: Texas Instruments->C2000
 * Code generation objectives: Unspecified
 * Validation result: Not run
 */

#include "part4_implement_starterBUTforpart5.h"

/* Block parameters (default storage) */
P_part4_implement_starterBUTf_T part4_implement_starterBUTfor_P = {
  /* Variable: A
   * Referenced by: '<Root>/State-Space'
   */
  { 0.0, 72.25, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
    0.0 },

  /* Variable: StartStop___PWM
   * Referenced by:
   *   '<Root>/Constant2'
   *   '<Root>/Constant7'
   */
  1.0,

  /* Mask Parameter: AsymmetricLinearFriction_interc
   * Referenced by: '<S1>/Constant'
   */
  0.05,

  /* Mask Parameter: AsymmetricLinearFriction_inte_g
   * Referenced by: '<S1>/Constant1'
   */
  -0.05,

  /* Mask Parameter: AsymmetricLinearFriction_slope1
   * Referenced by: '<S1>/B1'
   */
  0.08,

  /* Mask Parameter: AsymmetricLinearFriction_slope2
   * Referenced by: '<S1>/B2'
   */
  0.08,

  /* Expression: 0.1
   * Referenced by: '<S1>/Switch1'
   */
  0.1,

  /* Expression: 0
   * Referenced by: '<S1>/Switch'
   */
  0.0,

  /* Expression: 10
   * Referenced by: '<Root>/Saturation'
   */
  10.0,

  /* Expression: -10
   * Referenced by: '<Root>/Saturation'
   */
  -10.0,

  /* Expression: -1
   * Referenced by: '<Root>/Gain3'
   */
  -1.0,

  /* Computed Parameter: Out1_Y0
   * Referenced by: '<S3>/Out1'
   */
  0.0,

  /* Expression: 1
   * Referenced by: '<Root>/Constant3'
   */
  1.0,

  /* Expression: [B L_new]
   * Referenced by: '<Root>/State-Space'
   */
  { 0.0, -1.0697, 0.0, 185.7242, 96.999999999982549, 2422.249999999151, 0.0, 0.0,
    0.0, 0.0, 96.999999999982549, 2349.999999999151 },

  /* Expression: eye(4)
   * Referenced by: '<Root>/State-Space'
   */
  { 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
    1.0 },

  /* Expression: 0
   * Referenced by: '<Root>/State-Space'
   */
  0.0,

  /* Expression: -(2*pi)/5000
   * Referenced by: '<Root>/phi_p_Gain'
   */
  -0.0012566370614359172,

  /* Expression: (2*pi)/4000
   * Referenced by: '<Root>/phi_r_Gain'
   */
  0.0015707963267948967,

  /* Expression: -[-190.1316,-18.3993,0,-0.0305]
   * Referenced by: '<Root>/Gain'
   */
  { 190.1316, 18.3993, -0.0, 0.0305 },

  /* Computed Parameter: TransferFcn_A
   * Referenced by: '<Root>/Transfer Fcn'
   */
  -50.0,

  /* Computed Parameter: TransferFcn_C
   * Referenced by: '<Root>/Transfer Fcn'
   */
  -2500.0,

  /* Computed Parameter: TransferFcn_D
   * Referenced by: '<Root>/Transfer Fcn'
   */
  50.0,

  /* Expression: 0
   * Referenced by: '<S1>/Constant2'
   */
  0.0,

  /* Expression: 0.1
   * Referenced by: '<S1>/Switch2'
   */
  0.1,

  /* Expression: 0
   * Referenced by: '<Root>/Gain1'
   */
  0.0,

  /* Expression: -pi
   * Referenced by: '<Root>/Constant'
   */
  -3.1415926535897931,

  /* Expression: 0
   * Referenced by: '<S2>/Constant6'
   */
  0.0,

  /* Expression: 0
   * Referenced by: '<Root>/Constant9'
   */
  0.0,

  /* Expression: 250
   * Referenced by: '<S2>/Gain'
   */
  250.0,

  /* Expression: 2500
   * Referenced by: '<S2>/Constant5'
   */
  2500.0,

  /* Expression: 1
   * Referenced by: '<Root>/Pulse Generator'
   */
  1.0,

  /* Computed Parameter: PulseGenerator_Period
   * Referenced by: '<Root>/Pulse Generator'
   */
  500.0,

  /* Computed Parameter: PulseGenerator_Duty
   * Referenced by: '<Root>/Pulse Generator'
   */
  250.0,

  /* Expression: 0
   * Referenced by: '<Root>/Pulse Generator'
   */
  0.0,

  /* Expression: 0
   * Referenced by: '<Root>/Switch1'
   */
  0.0,

  /* Expression: 1
   * Referenced by: '<S2>/Constant8'
   */
  1.0
};

/* Constant parameters (default storage) */
const ConstP_part4_implement_starte_T part4_implement_starterB_ConstP = {
  /* Expression: A-L_new*C
   * Referenced by: '<Root>/State-Space'
   */
  { 96.999999999982549, 2422.249999999151, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.0, 96.999999999982549, 2349.999999999151, 0.0, 0.0, 0.0, 0.0 }
};

/*
 * File trailer for generated code.
 *
 * [EOF]
 */
