bp=1.0697;
br=185.7242;
a=72.25; %guess

A = [0  1;
     a  0];
B = [0;
     -bp];

omega=1.1*sqrt(a);
zeta=0.5

% sys1 = tf([1], [1 2*zeta*omega omega^2]);
% p = pole(sys1);

p1=-zeta*omega+(j*omega*sqrt(1-zeta^2));
p2=-zeta*omega-(j*omega*sqrt(1-zeta^2));
p=[p1,p2];


K=place(A,B,p)

%OBSERVATIONS:
%IC=