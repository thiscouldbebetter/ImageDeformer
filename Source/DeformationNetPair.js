
class DeformationNetPair
{
	constructor(netBeforeDeformation, netAfterDeformation)
	{
		this.netBeforeDeformation = netBeforeDeformation;
		this.netAfterDeformation = netAfterDeformation;

		this.isNetBeforeRatherThanAfterSelected = true;
	}

	static fromSize(size)
	{
		var scaleFactor = .8;
		var offset = new Coords(1, 1, 1).multiplyScalar
		(
			(1 - scaleFactor) / 2
		);
		var sizeOfNet = size.clone().multiplyScalar(scaleFactor);

		var netSizeInNodes = new Coords(2, 2, 1);

		var nodePositionRowsAfter =
		[
			[ new Coords(0, 0, 0), new Coords(1, 0, 0) ],
			[ new Coords(0, 1, 0), new Coords(1, 1, 0) ]
		];

		nodePositionRowsAfter.forEach
		(
			row =>
			{
				row.forEach
				(
					nodePos =>
					{
						nodePos.add(offset).multiply(sizeOfNet);
					}
				);
			}
		);

		var nodeRowsAfter =
			nodePositionRowsAfter.map(row => row.map(x => new NetNode(x) ) );

		var netAfter = new Net(netSizeInNodes, nodeRowsAfter);

		var netBefore = netAfter.clone();
		var nodeRowsBefore = netAfter.nodeRows;
		var center = size.clone().divideScalar(2);
		nodeRowsBefore.forEach
		(
			row =>
			{
				row.forEach
				(
					node =>
					{
						node.pos
							.subtract(center)
							.multiplyScalar(scaleFactor)
							.add(center);
					}
				);
			}
		)

		var returnPair =
			new DeformationNetPair(netBefore, netAfter);

		return returnPair;
	}

	drawToGraphicsContext(graphicsContext)
	{
		this.netBeforeDeformation.drawToGraphicsContextUsingColorAndIsSelected
		(
			graphicsContext,
			"Cyan",
			this.isNetBeforeRatherThanAfterSelected
		);
		this.netAfterDeformation.drawToGraphicsContextUsingColorAndIsSelected
		(
			graphicsContext,
			"Blue",
			(this.isNetBeforeRatherThanAfterSelected == false)
		);
	}

	netSelectByName(netToSelectName)
	{
		this.isNetBeforeRatherThanAfterSelected =
			(netToSelectName == "Before");
	}

	netSelected()
	{
		var returnValue =
		(
			this.isNetBeforeRatherThanAfterSelected
			? this.netBeforeDeformation
			: this.netAfterDeformation
		);

		return returnValue;
	}
}