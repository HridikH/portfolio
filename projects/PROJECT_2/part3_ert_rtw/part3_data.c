/*
 * Academic License - for use in teaching, academic research, and meeting
 * course requirements at degree granting institutions only.  Not for
 * government, commercial, or other organizational use.
 *
 * File: part3_data.c
 *
 * Code generated for Simulink model 'part3'.
 *
 * Model version                  : 9.23
 * Simulink Coder version         : 24.2 (R2024b) 21-Jun-2024
 * C/C++ source code generated on : Tue Nov 18 09:22:06 2025
 *
 * Target selection: ert.tlc
 * Embedded hardware selection: Texas Instruments->C2000
 * Code generation objectives: Unspecified
 * Validation result: Not run
 */

#include "part3.h"

/* Block parameters (default storage) */
P_part3_T part3_P = {
  /* Variable: StartStop___PWM
   * Referenced by:
   *   '<Root>/Constant2'
   *   '<Root>/Constant7'
   */
  1.0,

  /* Expression: 0
   * Referenced by: '<S1>/Constant6'
   */
  0.0,

  /* Expression: -1
   * Referenced by: '<Root>/Gain3'
   */
  -1.0,

  /* Computed Parameter: Out1_Y0
   * Referenced by: '<S2>/Out1'
   */
  0.0,

  /* Expression: 1
   * Referenced by: '<Root>/Constant3'
   */
  1.0,

  /* Expression: 0
   * Referenced by: '<Root>/Constant'
   */
  0.0,

  /* Expression: 5
   * Referenced by: '<Root>/Constant1'
   */
  5.0,

  /* Expression: -(2*pi)/5000
   * Referenced by: '<Root>/Gain1'
   */
  -0.0012566370614359172,

  /* Expression: (2*pi)/4000
   * Referenced by: '<Root>/Gain2'
   */
  0.0015707963267948967,

  /* Expression: .5
   * Referenced by: '<Root>/Switch'
   */
  0.5,

  /* Expression: 0
   * Referenced by: '<Root>/Constant9'
   */
  0.0,

  /* Expression: 250
   * Referenced by: '<S1>/Gain'
   */
  250.0,

  /* Expression: 2500
   * Referenced by: '<S1>/Constant5'
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
   * Referenced by: '<S1>/Constant8'
   */
  1.0
};

/*
 * File trailer for generated code.
 *
 * [EOF]
 */
