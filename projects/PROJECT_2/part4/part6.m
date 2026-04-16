bp=1.0697;
br=185.7242;
a=72.25; %calculated

Aup = [0  1   0   0;
     a  0   0   0;
     0  0   0   1;
     0  0   0   0];
Adwn = [0  1   0   0;
    -a  0   0   0;
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


Kup=place(Aup,B,p)
Kdwn=place(Adwn,B,p)
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
%L = place(A',C',[-46.7500,-47,-46.500,-50])'

% p1,p2,p3,p4
% eig(A-L*C)

A1up = [0 1;
        a 0];
A1dwn = [0 1;
        -a 0];
C1 = [1 0];
A2up = [0 1;
        0 0];
A2dwn = [0 1;
        0 0];
C2 = [1 0];

L1up = place(A1up',C1',[-47,-50])
L2up = place(A2up',C2',[-47,-50])

L1dwn = place(A1dwn',C1',[-47,-50])
L2dwn = place(A2dwn',C2',[-47,-50])

L_newup = zeros(4, 2);
L_newup(1:2, 1) = L1up;
L_newup(3:4, 2) = L2up;

L_newdwn = zeros(4, 2);
L_newdwn(1:2, 1) = L1dwn;
L_newdwn(3:4, 2) = L2dwn;