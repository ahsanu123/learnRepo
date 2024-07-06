using Plots

function seperHalfSquare(x)
  return 1 - x^2 / 2
end

function inverseNotchFilter(x)
  (1 + x^2)^-1
end

function trippleX(x)
  return x^3 - x
end

# plot(seperHalfSquare, -3, 3, label="Seper Half Square")
# plt = plot!(inverseNotchFilter, -3, 3, label="inverseNotchFilter")

plt = plot(trippleX, -1, 1)
display(plt)

while true
end



