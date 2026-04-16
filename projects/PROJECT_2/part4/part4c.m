bp=1.0697;
br=185.7242;
a=72.25; %calculated

A = [0  1   0   0;
     a  0   0   0;
     0  0   0   1;
     0  0   0   0];
B = [0;
     -bp;
     0;
     br];

omega=1.1*sqrt(a);
zeta=0.5

% sys1 = tf([1], [1 2*zeta*omega omega^2]);
% p = pole(sys1);

p1=-zeta*omega+(j*omega*sqrt(1-zeta^2));
p2=-zeta*omega-(j*omega*sqrt(1-zeta^2));
p3=-zeta*omega %this is just -zeta*omega;
p4=0;
p=[p1,p2,p3,p4];


K=place(A,B,p)

%OBSERVATIONS:
%IC=

C = [1  0   0   0;
     0  0   1   0];

%A-BK;  place(A,B,p) gives K
%A-LC;  place(A,C,p) will not give L, hence transpose

%L = place(A',C',[-45, -45 + j*10, -45 - j*10, -55])';%10*[p1,p2,p3,p4])'
%L = place(A',C',10*[p1,p2,p3,p4])'
%L = place(A',C',[-46.7500+8.09734i,-46.7500-8.09734i,-46.7500,0])' %selection of poles are subjective, must faster than poles of CL system. 4 pole negative delibreatly instead of zero
%L = place(A',C',[-45, -45 + j*10, -45 - j*10, -55])';
% L = place(A',C',[-46.7500,-46.7500+8.09734i,-46.7500-8.09734i,-50])'  %OKAY SO THIS WORKED CAUSE WE CHANGED THE ORDER OF POLES
L = place(A',C',[-46.7500,-47,-46.500,-50])'

p1,p2,p3,p4
eig(A-L*C)

