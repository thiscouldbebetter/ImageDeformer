
class Net
{
	constructor(sizeInNodes, nodeRows)
	{
		this.sizeInNodes = sizeInNodes;
		this.nodeRows = nodeRows;

		this.sizeInNodes =
			new Coords(this.nodeRows[0].length, this.nodeRows.length);

		this.nodeSelectedPosInNodes = new Coords(0, 0);

		var nodesAll = [];
		for (var y = 0; y < this.nodeRows.length; y++)
		{
			var nodeRow = this.nodeRows[y];
			nodesAll.push(...nodeRow);
		}
		this.nodesAll = nodesAll;

		for (var y = 0; y < this.sizeInNodes.y; y++)
		{
			var nodeRow = this.nodeRows[y];

			var yNext =
				y + (y < this.sizeInNodes.y - 1 ? 1 : -1);

			for (var x = 0; x < this.sizeInNodes.x; x++)
			{
				var node = nodeRow[x];

				var xNext =
					x + (x < this.sizeInNodes.x - 1 ? 1 : -1);

				var nodeNeighborX = nodeRow[xNext];
				var nodeNeighborY = this.nodeRows[yNext][x];

				var nodePos = node.pos;

				node.neighborDisplacements[0]
					.overwriteWith(nodeNeighborX.pos)
					.subtract(nodePos);

				node.neighborDisplacements[1]
					.overwriteWith(nodeNeighborY.pos)
					.subtract(nodePos);
			}
		}

		this._displacement = new Coords();
	}

	clone()
	{
		var nodeRowsCloned = this.nodeRows.map
		(
			row => row.map(x => x.clone() )
		);

		return new Net
		(
			this.sizeInNodes.clone(),
			nodeRowsCloned
		)
	}

	nodeAtIndex(index)
	{
		return this.nodesAll[index];
	}

	nodeNearestPosGetIndex(posToCheck)
	{
		var displacement = this._displacement;

		var distanceMinSoFar = null;
		var nodeWithDistanceMinSoFarIndex = null;

		for (var i = 0; i < this.nodesAll.length; i++)
		{
			var node = this.nodesAll[i];

			var distance = displacement
				.overwriteWith(node.pos)
				.subtract(posToCheck)
				.magnitude();

			if (distanceMinSoFar == null || distance < distanceMinSoFar)
			{
				distanceMinSoFar = distance;
				nodeWithDistanceMinSoFarIndex = i;
			}
		}

		return nodeWithDistanceMinSoFarIndex;
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
		var row = this.nodeRows[this.nodeSelectedPosInNodes.y];
		var nodePos = row[this.nodeSelectedPosInNodes.x].pos;
		return nodePos;
	}

	drawToGraphicsContextUsingColorAndIsSelected
	(
		graphicsContext, color, isSelected
	)
	{
		graphicsContext.strokeStyle = color;

		var drawPos = new Coords();

		this.nodeRows.forEach
		(
			row =>
			{
				row.forEach
				(
					node =>
					{
						var nodePos = node.pos;

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