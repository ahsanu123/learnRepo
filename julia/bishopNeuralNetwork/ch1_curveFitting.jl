#!/usr/bin/julia
using Plots
using LaTeXStrings

x = range(0, 2, 50)
y = sin.(2 * pi * x)

plot(x, y, label=L"\frac{1}{1+x}")
plot!(xscale=:log10, yscale=:log10, minorgrid=true)
xlims!(1e+0, 1e+4)
ylims!(1e-5, 1e+0)
title!(L"Log-log plot of $\frac{1}{1+x}$")
xlabel!(L"x")
ylabel!(L"y")

