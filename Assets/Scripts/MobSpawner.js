#pragma strict

public var AllMobs : BaseMob[];

public static var MobCount : int = 0;

public var CurrentMobCount : int = 0;

public static var instance : MobSpawner;

public var WaveCounter : int = 0;

public var NorthWall : Transform;
public var SouthWall : Transform;
public var EastWall : Transform;
public var WestWall : Transform;

public var Player : PlayerShip;
public var PlayerPrefab : PlayerShip;

public var XSize : int = 10;
public var YSize : int = 10;

public var SpawnPointSpillover : int = 0;
public var PointsEarned : int = 0;

public static var LevelBounds : Bounds;

public var bDebug : boolean = false;

function Start () {
	if(instance)
	{
		if(instance != this) Destroy(this);
	}
	else
	{
		instance = this;
		
	
		ResetGame();
		
		if(!PlayerPrefab)
		{
			Debug.LogError("Error:  No player prefab!");
			Debug.Break();
		}
		
		//Camera needs to be zoomed to match as well... it's ortho so just have to set the size properly.  Worry about it later.
		
	}
}

function Update () {

	CurrentMobCount = MobCount;

	if(MobCount < 0)
	{
		Debug.LogError("MobCount went negative! what in the...");
	}
	
	if(MobCount <= 0)
	{
		//End of the wave, time to spawn new mobs.
		WaveCounter += 1;
		
		if(bDebug) Debug.Log("Spawning wave " + WaveCounter);

		var SpawnCount : int;
		SpawnCount = WaveCounter * WaveCounter; //x squared seems like a rough way to go really, the difficulty gets steep fast.
				
		var SpawnPointsRemaining : int = SpawnCount + SpawnPointSpillover;
		
		
		var AvailableMobs : Generic.List.<BaseMob> = new Generic.List.<BaseMob>();
		var i : int;
		
		for (i = 0; i < AllMobs.length; i++)
		{
			if(bDebug) Debug.Log("i: " + i);
			if (AllMobs[i].ScoreValue <=  SpawnCount)
				AvailableMobs.Add(AllMobs[i]);
		}
		if(bDebug) Debug.Log("AvailableMobs.Count: " + AvailableMobs.Count);

		while(SpawnPointsRemaining > 0)
		{
			var NewMob : BaseMob;
			var MobInt : int = Random.Range(0, AvailableMobs.Count);
			var SpawnClusterSize : int = 1;
			
			NewMob = AvailableMobs[MobInt];
			
			//I can do better than this division but not a problem for the moment...
			var targetLocation : Vector3 = new Vector3(Random.Range(-XSize / 2,XSize / 2), 0, Random.Range(-YSize / 2,YSize / 2));
			
			if(SpawnPointsRemaining > 50 * NewMob.ScoreValue)
			{
				NewMob.LevelUp();
				if(bDebug) Debug.Log("LevelUp!");
			}
			
			if(SpawnPointsRemaining > 10 * NewMob.ScoreValue)
			{
				SpawnClusterSize = 5;
				if(bDebug) Debug.Log("Spawning cluster of 5");
			}
			
			for(var j : int = 0; j < SpawnClusterSize; j++)
			{
				Instantiate(NewMob, targetLocation, Random.rotation);
				MobCount += 1;
				SpawnPointsRemaining -= NewMob.ScoreValue;
			}
			
			if(!NewMob)
			{
				SpawnPointsRemaining = 0;
			}
			
			if (MobCount > 100)
			{
				return;
			}
		
		}
		//for(i = 0; i < SpawnCount; i++)
		//{
			//var targetLocation : Vector3 = new Vector3(Random.Range(-9f,9f), 0, Random.Range(-9f,9f));
			
			
			
			//Instantiate(PassiveMob, targetLocation, Quaternion.identity);
			//MobCount += 1;
			//Ok, this is a little complex. I want it to spawn enemies based on their point values.
			//So it'll create a list of the available mobs for a given wave.  It'll spawn from that list at random until it's out of points.
			//Can toss in modifiers in there - Giant, tiny, swarms, whatever.  Maybe.  Later.
			
			
			
		//}
		if(SpawnPointsRemaining != 0) SpawnPointSpillover =  SpawnPointsRemaining;
	}

	
}



function OnDrawGizmos()
{
	Gizmos.DrawWireSphere(transform.position, 1);
}

function ResetGame()
{

	if (XSize < 5) XSize = 5;
	if (YSize < 5) YSize = 5;
	
	LevelBounds.SetMinMax(new Vector3((-XSize / 2) - 1, -1, -(YSize / 2) - 1), new Vector3(1 + XSize / 2, 1, 1 + YSize / 2));
	
	NorthWall.position.z = (YSize + 2) / 2;
	NorthWall.localScale.x = XSize + 1;
	
	SouthWall.position.z = -(YSize + 2) / 2;
	SouthWall.localScale.x = XSize + 1;
	
	EastWall.position.x = (XSize + 2) / 2;
	EastWall.localScale.z = YSize + 3;
	
	WestWall.position.x = -(XSize + 2) / 2;
	WestWall.localScale.z = YSize + 3;
	
		
	SpawnPointSpillover = 0;
	PointsEarned = 0;
	WaveCounter = 0;

	for (var i : int = 0; i < AllMobs.length; i++)
	{
		AllMobs[i].ResetLevel();
	}
	
	Player = Instantiate(PlayerPrefab, new Vector3(0,0,0), Quaternion.identity);
}

function OnGUI()
{
	if(!Player)
	{
		//Well that didn't work.
		//It says 'missing', I wonder what it actually is at this point.
		GUI.Label(new Rect(25,25,50,50), "GAME OVAR!!");
	}
	//Debug.Log(Player);
}