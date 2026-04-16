% -------------------------------------------------------------%
% [Mp, tr, ts,MpIndex, t_10index,t_90index,tssIndex] =
% StepResponseMetrics(y,t, yStartIndex, ssVal)
%
% DESCRIPTION:
% function StepResponseMetrics determines the overshoot, 
% rise-time, and steady-state time for a step input signal. 
%
%INPUTS:
% y : a 1 dimensional array of the response
% t : an array of the time (in seconds)
% yStartIndex : (integer) the array index when the step input begins
% ssVal : the steady state value that y approaches
%
%OUTPUTS:
%Mp : overshoot percent
%tr : rise time for the signal 10-90%
%ts : time from 
%MpIndex: index of the time array where it is maximum
%t_10index:  index of the time array where it is first at 10% of signal
%t_90index:  index of the time array where it is first at 90% of signal
%tssIndex:   index of the time array where it is at steady-state

out=sim("Pcontrol");
wref=100;
ssVal=100;

%tr
% tr is the time required for the response to rise from 10% of the
% steady-state value to 90% of the steady-state value.  The function 'find'
% is useful here.  Type "helpwin find" to see how it works.  
t_10index = find(  y > .1*ssVal, 1, 'first');
t_90index = find(  y < .9*ssVal, 1, 'last');
% I've done the 10% index, you do the 90%:
t_90index  = 
tr = t(t_90index )-t(t_10index );

x = [2.4,1.7,1.45,1.15,0.88];
y = [150,100,75,50,25];
coeffs=polyfit(x,y,1);

x_diff = [-2.36,-1.75,-1.46,-1.17,-0.89]
y_diff = [-150,-100,-75,-50,-25]