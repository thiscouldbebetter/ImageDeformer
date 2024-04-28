
class NetNode
{
	constructor(pos, neighborDisplacements)
	{
		this.pos = pos;

		this.neighborDisplacements =
			neighborDisplacements || [ new Coords(), new Coords() ];
	}

	clone()
	{
		return new NetNode
		(
			this.pos.clone(),
			this.neighborDisplacements.map(x => x.clone() )
		);
	}
}