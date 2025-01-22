'use client';

import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const AnimatedCounter = () => {
  const counters = [
    { target: 200, label: 'International Brands' },
    { target: 2000, label: 'High-Quality Products' },
    { target: 30000, label: 'Happy Customers' },
  ];

  // State to hold counter values
  const [counterValues, setCounterValues] = useState<number[]>(new Array(counters.length).fill(0));

  // Ref to track if the animation has already started
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return; // Skip the effect if animation has already started
    hasStarted.current = true; // Mark that animation has started

    // Function to update each counter's value over time
    const updateCounters = () => {
      counters.forEach((counter, index) => {
        let count = counterValues[index];
        const target = counter.target;
        const speed = 200; // The lower the slower
        const increment = target / speed;

        const updateCount = () => {
          // Avoid updating state if the value has already reached the target
          if (count < target) {
            count += increment;
            // Only update state if the value has changed
            setCounterValues((prevValues) => {
              const newValues = [...prevValues];
              newValues[index] = Math.min(count, target);
              return newValues;
            });
            requestAnimationFrame(updateCount); // Schedule next update
          } else {
            // Ensure the counter hits exactly the target
            setCounterValues((prevValues) => {
              const newValues = [...prevValues];
              newValues[index] = target;
              return newValues;
            });
          }
        };

        updateCount(); // Start the animation for this counter
      });
    };

    updateCounters(); // Start the counter animation only once
  }); // Empty dependency array ensures this effect runs only once after the first render

  // Helper function to format the number with commas
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat().format(Math.floor(number));
  };

  return (
    <Container>
      <MobileCountersSection>
        <div className="container font-poppins mt-[8vmin]">
          <CounterRow>
            <CounterBox>
              <Icon className={`fab fa-${counters[0].label.toLowerCase()} fa-4x`} />
              <Counter>{formatNumber(counterValues[0])}+</Counter>
              <h3>{counters[0].label}</h3>
            </CounterBox>
            <Divider />
            <CounterBox>
              <Icon className={`fab fa-${counters[1].label.toLowerCase()} fa-4x`} />
              <Counter>{formatNumber(counterValues[1])}+</Counter>
              <h3>{counters[1].label}</h3>
            </CounterBox>
          </CounterRow>
          <CenterCounterRow>
            <CounterBox>
              <Icon className={`fab fa-${counters[2].label.toLowerCase()} fa-4x`} />
              <Counter>{formatNumber(counterValues[2])}+</Counter>
              <h3>{counters[2].label}</h3>
            </CounterBox>
          </CenterCounterRow>
        </div>
      </MobileCountersSection>
    </Container>
  );
};

export default AnimatedCounter;

// Styled Components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const MobileCountersSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    display: flex;
    flex-wrap: wrap; /* Allow items to wrap */
    justify-content: space-between; /* Space out items */
    width: 100%;
  }

  // Show this section only on small screens (below 1024px)
  @media screen and (min-width: 1025px) {
    display: none;
  }
`;

const CounterRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const Divider = styled.div`
  height: 100%;
  width: 1px;
  background-color: #ddd; /* Set to gray color for the line */
  margin: 0 20px;
  align-self: stretch;
`;

const CenterCounterRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;

const CounterBox = styled.div`
  text-align: center;
  margin: 10px;
  width: 48%; /* Takes up half of the row */
  .fab {
    margin-bottom: 10px;
  }
  h3 {
    font-family: 'Satoshi', sans-serif; /* Apply the Satoshi font family */
    font-size: 2vmin;
    font-weight: 100;
    color: #000;
  }
`;

const Icon = styled.i`
  font-size: 3rem;
  color: #ff5733;
`;

const Counter = styled.div`
  font-family: 'Satoshi', sans-serif; /* Apply Satoshi font family here */
  font-size: 9vmin;
  font-weight: 600;
  color: #333;
`;
