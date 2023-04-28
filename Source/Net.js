
class Net
{
	constructor(sizeInNodes, nodePositionRows)
	{
		this.sizeInNodes = sizeInNodes;
		this.nodePositionRows = nodePositionRows;

		this.nodeSelectedPosInNodes = new Coords(0, 0);
	}

	clone()
	{
		return new Net
		(
			this.sizeInNodes.clone(),
			this.nodePositionRows.map
			(
				row => row.map(x => x.clone() )
			)
		)
	}

	nodeSelectByOffset(offset)
	{
		this.nodeSelectedPosInNodes.add
		(
			offset
		).wrapToMax
		(
			this.sizeInNodes
		);
	}

	nodeSelectedPosition()
	{
		var row = this.nodePositionRows[this.nodeSelectedPosInNodes.y];
		var nodePos = row[this.nodeSelectedPosInNodes.x];
		return nodePos;
	}

	drawToGraphicsContextUsingColorAndIsSelected
	(
		graphicsContext, color, isSelected
	)
	{
		graphicsContext.strokeStyle = color;

		var drawPos = new Coords();

		this.nodePositionRows.forEach
		(
			row =>
			{
				row.forEach
				(
					nodePos =>
					{
						drawPos.overwriteWith
						(
							nodePos
						); // todo

						graphicsContext.beginPath();
						graphicsContext.arc
						(
							drawPos.x, drawPos.y, // center
							2, // radius
							0, Math.PI * 2 // start and stop angles
						);
						graphicsContext.stroke();
					}
				)
			}
		);

		if (isSelected)
		{
			var nodeSelectedPos = this.nodeSelectedPosition();
			if (nodeSelectedPos != null)
			{
				graphicsContext.fillStyle = color;
				graphicsContext.beginPath();
				graphicsContext.arc
				(
					nodeSelectedPos.x, nodeSelectedPos.y, // center
					2, // radius
					0, Math.PI * 2 // start and stop angles
				);
				graphicsContext.fill();
			}
		}
	}
}
