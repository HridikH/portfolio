figure
plot(MotorData(:,1),MotorData(:,2))
figure
plot(ReacData(:,1),ReacData(:,2))

% omega = 8.5369

%% Last part
time_Reac = ReacData(:,1);
th_p_Reac = ReacData(:,2);
th_r_Reac = ReacData(:,3);
u_Reac = ReacData(:,4);
[bpMax, brMax] = Find_bp_and_br(time_Reac,th_p_Reac,th_r_Reac,u_Reac)