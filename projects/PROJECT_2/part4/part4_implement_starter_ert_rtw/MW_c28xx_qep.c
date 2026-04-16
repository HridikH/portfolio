#include "c2000BoardSupport.h"
#include "MW_f2837xD_includes.h"
#include "rtwtypes.h"
#include "part4_implement_starter.h"
#include "part4_implement_starter_private.h"

void config_QEP_eQEP1(uint32_T pcmaximumvalue, uint32_T pcInitialvalue, uint32_T
                      unittimerperiod, uint32_T comparevalue, uint16_T
                      watchdogtimer, uint16_T qdecctl, uint16_T qepctl, uint16_T
                      qposctl, uint16_T qcapctl, uint16_T qeint)
{
  EALLOW;
  CpuSysRegs.PCLKCR4.bit.EQEP1 = 1U;
  EDIS;
  EALLOW;                              /* Enable EALLOW*/

  /* Enable internal pull-up for the selected pins */
  GpioCtrlRegs.GPAPUD.bit.GPIO20 = 0U; /* Enable pull-up on GPIO20 (EQEP1A)*/
  GpioCtrlRegs.GPAPUD.bit.GPIO21 = 0U; /* Enable pull-up on GPIO21 (EQEP1B)*/
  GpioCtrlRegs.GPDPUD.bit.GPIO99 = 0U; /* Enable pull-up on GPIO99 (EQEP1I)*/

  /* Configure eQEP-1 pins using GPIO regs*/
  GpioCtrlRegs.GPAMUX2.bit.GPIO20 = 1U;/* Configure GPIO20 as EQEP1A*/
  GpioCtrlRegs.GPAGMUX2.bit.GPIO20 = 0U;
  GpioCtrlRegs.GPAMUX2.bit.GPIO21 = 1U;/* Configure GPIO21 as EQEP1B  */
  GpioCtrlRegs.GPAGMUX2.bit.GPIO21 = 0U;
  GpioCtrlRegs.GPDMUX1.bit.GPIO99 = 1U;/* Configure GPIO99 as EQEP1I*/
  GpioCtrlRegs.GPDGMUX1.bit.GPIO99 = 1U;
  EDIS;
  EQep1Regs.QPOSINIT = pcInitialvalue; /*eQEP Initialization Position Count*/
  EQep1Regs.QPOSMAX = pcmaximumvalue;  /*eQEP Maximum Position Count*/
  EQep1Regs.QUPRD = unittimerperiod;   /*eQEP Unit Period Register*/
  EQep1Regs.QWDPRD = watchdogtimer;    /*eQEP watchdog timer Register*/
  EQep1Regs.QDECCTL.all = qdecctl;   /*eQEP Decoder Control (QDECCTL) Register*/
  EQep1Regs.QEPCTL.all = qepctl;       /*eQEP Control (QEPCTL) Register*/
  EQep1Regs.QPOSCTL.all = qposctl;
                            /*eQEP Position-compare Control (QPOSCTL) Register*/
  EQep1Regs.QCAPCTL.all = qcapctl;   /*eQEP Capture Control (QCAPCTL) Register*/
  EQep1Regs.QEPCTL.bit.FREE_SOFT = 2U; /*unaffected by emulation suspend*/
  EQep1Regs.QPOSCMP = comparevalue;    /*eQEP Position-compare*/
  EQep1Regs.QEINT.all = qeint;         /*eQEPx interrupt enable register*/
}

void config_QEP_eQEP2(uint32_T pcmaximumvalue, uint32_T pcInitialvalue, uint32_T
                      unittimerperiod, uint32_T comparevalue, uint16_T
                      watchdogtimer, uint16_T qdecctl, uint16_T qepctl, uint16_T
                      qposctl, uint16_T qcapctl, uint16_T qeint)
{
  EALLOW;
  CpuSysRegs.PCLKCR4.bit.EQEP2 = 1U;
  EDIS;
  EALLOW;                              /* Enable EALLOW*/

  /* Enable internal pull-up for the selected pins */
  GpioCtrlRegs.GPBPUD.bit.GPIO54 = 0U; /* Enable pull-up on GPIO54 (EQEP2A)*/
  GpioCtrlRegs.GPBPUD.bit.GPIO55 = 0U; /* Enable pull-up on GPIO55 (EQEP2B)*/
  GpioCtrlRegs.GPBPUD.bit.GPIO57 = 0U; /* Enable pull-up on GPIO57 (EQEP2I)*/

  /* Configure eQEP-2 pins using GPIO regs*/
  GpioCtrlRegs.GPBMUX2.bit.GPIO54 = 1U;/* Configure GPIO54 as EQEP2A*/
  GpioCtrlRegs.GPBGMUX2.bit.GPIO54 = 1U;
  GpioCtrlRegs.GPBMUX2.bit.GPIO55 = 1U;/* Configure GPIO55 as EQEP2B  */
  GpioCtrlRegs.GPBGMUX2.bit.GPIO55 = 1U;
  GpioCtrlRegs.GPBMUX2.bit.GPIO57 = 1U;/* Configure GPIO57 as EQEP2I*/
  GpioCtrlRegs.GPBGMUX2.bit.GPIO57 = 1U;
  EDIS;
  EQep2Regs.QPOSINIT = pcInitialvalue; /*eQEP Initialization Position Count*/
  EQep2Regs.QPOSMAX = pcmaximumvalue;  /*eQEP Maximum Position Count*/
  EQep2Regs.QUPRD = unittimerperiod;   /*eQEP Unit Period Register*/
  EQep2Regs.QWDPRD = watchdogtimer;    /*eQEP watchdog timer Register*/
  EQep2Regs.QDECCTL.all = qdecctl;   /*eQEP Decoder Control (QDECCTL) Register*/
  EQep2Regs.QEPCTL.all = qepctl;       /*eQEP Control (QEPCTL) Register*/
  EQep2Regs.QPOSCTL.all = qposctl;
                            /*eQEP Position-compare Control (QPOSCTL) Register*/
  EQep2Regs.QCAPCTL.all = qcapctl;   /*eQEP Capture Control (QCAPCTL) Register*/
  EQep2Regs.QEPCTL.bit.FREE_SOFT = 2U; /*unaffected by emulation suspend*/
  EQep2Regs.QPOSCMP = comparevalue;    /*eQEP Position-compare*/
  EQep2Regs.QEINT.all = qeint;         /*eQEPx interrupt enable register*/
}
