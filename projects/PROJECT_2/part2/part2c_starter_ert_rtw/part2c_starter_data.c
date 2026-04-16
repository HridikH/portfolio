/*
 * Academic License - for use in teaching, academic research, and meeting
 * course requirements at degree granting institutions only.  Not for
 * government, commercial, or other organizational use.
 *
 * File: part2c_starter_data.c
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

#include "part2c_starter.h"

/* Block parameters (default storage) */
P_part2c_starter_T part2c_starter_P = {
  /* Variable: StartStop___PWM
   * Referenced by:
   *   '<Root>/Constant2'
   *   '<Root>/Constant7'
   */
  1.0,

  /* Mask Parameter: AsymmetricLinearFriction_interc
   * Referenced by: '<S1>/Constant'
   */
  0.55,

  /* Mask Parameter: AsymmetricLinearFriction_inte_b
   * Referenced by: '<S1>/Constant1'
   */
  -0.584594594594594,

  /* Mask Parameter: AsymmetricLinearFriction_slope1
   * Referenced by: '<S1>/B1'
   */
  0.012091891891892,

  /* Mask Parameter: AsymmetricLinearFriction_slope2
   * Referenced by: '<S1>/B2'
   */
  0.011767567567568,

  /* Expression: 10
   * Referenced by: '<Root>/Saturation'
   */
  10.0,

  /* Expression: -10
   * Referenced by: '<Root>/Saturation'
   */
  -10.0,

  /* Computed Parameter: Out1_Y0
   * Referenced by: '<S3>/Out1'
   */
  0.0,

  /* Expression: 0.1
   * Referenced by: '<Root>/Ki'
   */
  0.1,

  /* Expression: 0.11
   * Referenced by: '<Root>/Kp'
   */
  0.11,

  /* Expression: 0.1
   * Referenced by: '<S1>/Switch1'
   */
  0.1,

  /* Expression: 0
   * Referenced by: '<S1>/Switch'
   */
  0.0,

  /* Expression: 0.1
   * Referenced by: '<S1>/Switch2'
   */
  0.1,

  /* Expression: 1
   * Referenced by: '<Root>/Constant3'
   */
  1.0,

  /* Expression: -2*pi/5000
   * Referenced by: '<Root>/Gain1'
   */
  -0.0012566370614359172,

  /* Expression: 2*pi/4000
   * Referenced by: '<Root>/Gain'
   */
  0.0015707963267948967,

  /* Expression: 0
   * Referenced by: '<Root>/Unit Delay'
   */
  0.0,

  /* Expression: 1/0.002
   * Referenced by: '<Root>/Gain2'
   */
  500.0,

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

  /* Expression: 0
   * Referenced by: '<Root>/Constant1'
   */
  0.0,

  /* Expression: 1
   * Referenced by: '<Root>/Step'
   */
  1.0,

  /* Expression: 0
   * Referenced by: '<Root>/Step'
   */
  0.0,

  /* Expression: 100
   * Referenced by: '<Root>/Step'
   */
  100.0,

  /* Expression: 0
   * Referenced by: '<Root>/Integrator '
   */
  0.0,

  /* Expression: 0
   * Referenced by: '<Root>/Constant'
   */
  0.0,

  /* Expression: -1
   * Referenced by: '<Root>/Gain4'
   */
  -1.0,

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
   * Referenced by: '<Root>/Switch'
   */
  0.0,

  /* Expression: 1
   * Referenced by: '<S2>/Constant8'
   */
  1.0,

  /* Computed Parameter: ManualSwitch_CurrentSetting
   * Referenced by: '<Root>/Manual Switch'
   */
  0U,

  /* Computed Parameter: ManualSwitch2_CurrentSetting
   * Referenced by: '<Root>/Manual Switch2'
   */
  1U,

  /* Computed Parameter: resetintegrator_CurrentSetting
   * Referenced by: '<Root>/reset integrator'
   */
  0U,

  /* Computed Parameter: ManualSwitch1_CurrentSetting
   * Referenced by: '<Root>/Manual Switch1'
   */
  1U
};

/*
 * File trailer for generated code.
 *
 * [EOF]
 */
