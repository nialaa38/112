import React from 'react';
import { Card } from 'react-bootstrap';

const GanttChart = ({ project }) => {
  return (
    // col 12 size project timeline
    <div className="col-12">
        <div className="row">
            <div className="col-12">
                <Card className="mb-3">
                    <Card.Body>
                        <p> <strong>{project?.name}</strong> </p>
                        {/* Gantt chart here */}
                    </Card.Body>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default GanttChart;
